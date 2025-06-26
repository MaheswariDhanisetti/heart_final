require('dotenv').config();
const axios = require("axios");
const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
const {GoogleGenerativeAI} = require('@google/generative-ai');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/Health");

// User schema
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

// Health details schema
const healthSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    phone: String,
    email: String,
    bloodGroup: String,
    age: Number,
    gender: String,
    height: Number,
    weight: Number,
    healthHistory: String,
    allergies: String,
    emergencyContacts: [String]
});


//fit bit token data schema
const fitbitTokenSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    access_token: String,
    refresh_token: String,
    user_id: String,
    expires_at: Number  // Token expiry time (timestamp)
});

const FitbitToken = mongoose.model("FitbitToken", fitbitTokenSchema);

//fit bit health data schema
const fitbitDataSchema = new mongoose.Schema({
    email: { type: String, required: true },
    heartRate: Number,
    steps: Number,
    calories: Number,
    sleepMinutes: Number,
    respiratory_rate: Number,       
    oxygen_saturation: Number,      
    temperature: Number,            
    timestamp: { type: Date, default: Date.now }
});

const FitbitHealth = mongoose.model("FitbitHealth", fitbitDataSchema);


const User = mongoose.model("User", userSchema);
const HealthRecord = mongoose.model("HealthRecord", healthSchema);

// ✅ Registration form endpoint
app.post("/register-health", async (req, res) => {
    try {
        const newHealth = new HealthRecord(req.body);
        await newHealth.save();
        res.json({ message:  "Health registration successful" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error saving health data" });
    }
});

// ✅ Signup
app.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.json({ message: "User already exists" });

    const newUser = new User({ name, email, password });
    await newUser.save();
    res.json({ message: "User registered successfully" });
});

// ✅ Login
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.json({ message: "User not found" });
    if (user.password !== password) return res.json({ message: "Invalid password" });

    res.json({ message: "Login Successful" });
});

// ✅ Fitbit auth redirect
app.get("/api/fitbit/auth", (req, res) => {
    const scope = "profile activity heartrate sleep";
    const email = req.query.email;

    const redirectURL = `https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=${process.env.FITBIT_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.FITBIT_REDIRECT_URI)}&scope=${encodeURIComponent(scope)}&prompt=login&expires_in=604800&state=${encodeURIComponent(email)}`;

    res.redirect(redirectURL);
});



//modified one to store fit bit data also
app.get("/api/fitbit/callback", async (req, res) => {
    const { code, state } = req.query; // `state` has the email
    const email = state;

    if (!email) return res.status(400).send("Email missing in callback");

    const authHeader = Buffer
        .from(`${process.env.FITBIT_CLIENT_ID}:${process.env.FITBIT_CLIENT_SECRET}`)
        .toString("base64");

    try {
        const tokenResponse = await axios.post("https://api.fitbit.com/oauth2/token",
            new URLSearchParams({
                client_id: process.env.FITBIT_CLIENT_ID,
                grant_type: "authorization_code",
                redirect_uri: process.env.FITBIT_REDIRECT_URI,
                code
            }),
            {
                headers: {
                    "Authorization": `Basic ${authHeader}`,
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }
        );

        const { access_token, refresh_token, user_id, expires_in } = tokenResponse.data;

        // Save in MongoDB
        await FitbitToken.findOneAndUpdate(
            { email },
            {
                access_token,
                refresh_token,
                user_id,
                expires_at: Date.now() + expires_in * 1000  // expires_in is in seconds
            },
            { upsert: true } // create if not exist
        );


         // ✅ FETCH and STORE health data
        try {
            const headers = { Authorization: `Bearer ${access_token}` };
            const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

            // Heart Rate
            const heartRateRes = await axios.get(`https://api.fitbit.com/1/user/-/activities/heart/date/${today}/1d.json`, { headers });
            const heartRate = heartRateRes.data["activities-heart"]?.[0]?.value?.restingHeartRate || 0;

            // Steps
            const stepsRes = await axios.get(`https://api.fitbit.com/1/user/-/activities/steps/date/${today}/1d.json`, { headers });
            const steps = parseInt(stepsRes.data["activities-steps"]?.[0]?.value || 0);

            // Calories
            const caloriesRes = await axios.get(`https://api.fitbit.com/1/user/-/activities/calories/date/${today}/1d.json`, { headers });
            const calories = parseInt(caloriesRes.data["activities-calories"]?.[0]?.value || 0);

            // Sleep
            const sleepRes = await axios.get(`https://api.fitbit.com/1.2/user/-/sleep/date/${today}.json`, { headers });
            const sleepMinutes = sleepRes.data.summary?.totalMinutesAsleep || 0;

            // Save to DB
            await FitbitHealth.create({
                email,
                heartRate,
                steps,
                calories,
                sleepMinutes
            });


            console.log(`✅ Fitbit health data stored for ${email}`);
        } catch (err) {
            console.error("❌ Fitbit health data fetch error:", err?.response?.data || err.message);
        }


        console.log(`Stored Fitbit token for: ${email}`);

        // Redirect back to frontend with user_id (optional)
        res.redirect(`http://localhost:5173/register-health?fromFitbit=true&user=${user_id}`);
    } catch (error) {
        console.error("Fitbit callback error:", error?.response?.data || error.message);
        res.status(500).send("Fitbit Authentication Failed");
    }
});


// app.get("/api/dashboard", async (req, res) => {
//     const email = req.query.email;
//     if (!email) return res.status(400).json({ message: "Email is required" });

//     try {
//         // Get the latest Fitbit health record for the user
//         const latestHealth = await FitbitHealth.findOne({ email }).sort({ timestamp: -1 });

//         if (!latestHealth) {
//             return res.status(404).json({ message: "No Fitbit data found for this user." });
//         }

//         const response = {
//             heartRate: latestHealth.heartRate || 0,
//             steps: latestHealth.steps || 0,
//             sleep: `${latestHealth.sleepMinutes || 0} mins`,
//             nutrition: {
//                 calories: latestHealth.calories || 0,
//                 water: 2000,     // static placeholder
//                 protein: 50      // static placeholder
//             },
//             temperature: "98.6°F",       // placeholder
//             respiratoryRate: 16,         // placeholder
//             oxygenSaturation: "98%",     // placeholder
//             location: "Hyderabad, India",// placeholder
//             activity: {
//                 Monday: 30,
//                 Tuesday: 45,
//                 Wednesday: 20,
//                 Thursday: 60,
//                 Friday: 50,
//                 Saturday: 40,
//                 Sunday: 25
//             }
//         };

//         res.json(response);
//     } catch (err) {
//         console.error("Error fetching dashboard data:", err);
//         res.status(500).json({ message: "Server error fetching dashboard data" });
//     }
// });

app.get("/api/dashboard", async (req, res) => {
    const email = req.query.email;
    if (!email) return res.status(400).json({ message: "Email is required" });

    try {
        const latestHealth = await FitbitHealth.findOne({ email }).sort({ timestamp: -1 });

        if (!latestHealth) {
            return res.status(404).json({ message: "No Fitbit data found for this user." });
        }

        const response = {
            heartRate: latestHealth.heartRate,
            steps: latestHealth.steps,
            sleep: `${latestHealth.sleepMinutes} mins`,
            nutrition: {
                calories: latestHealth.calories,
                water: 2000,       // placeholder
                protein: 50        // placeholder
            },
            temperature: latestHealth.temperature ?? 98.6,
            respiratoryRate: latestHealth.respiratory_rate ?? 16,
            oxygenSaturation: latestHealth.oxygen_saturation ?? 97,
            location: latestHealth.location || "Hyderabad, India"
        };

        res.json(response);
    } catch (err) {
        console.error("❌ Server Error fetching dashboard data:", err.message);
        res.status(500).json({ message: "Server error fetching dashboard data" });
    }
});



const genAI = new GoogleGenerativeAI("AIzaSyBOncLKqTtyzXV07EWYCGEjGZHW5CE7oms");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post('/generate', async (req, res) => {
  const userSymptoms = req.body.symptoms?.trim();

  if (!userSymptoms) {
    return res.status(400).json({ error: "Symptoms are required." });
  }

  const prompt = `A user is experiencing the following symptoms: "${userSymptoms}".
Based on this, provide:
1. info: a short informative description
2. precaution: precautions to take
3. diet: suitable diet recommendations
4. medication: common medication advice

Return ONLY a JSON object with keys: info, precaution, diet, medication. Do NOT include markdown formatting (like triple backticks) or any explanation.`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // ? Clean triple backtick formatting (if present)
    const cleanedText = responseText
      .replace(/```json\s*|```/g, '') // Remove ```json and ```
      .trim();

    const parsed = JSON.parse(cleanedText);
    res.json(parsed);
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Failed to fetch diagnosis from Gemini API." });
  }
});


const profileSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  age: Number,
  email: String,
  phone: String,
  gender: String,
  bloodGroup: String,
  height: Number,
  weight: Number,
  healthHistory: String,
  allergies: String,
  emergencyContacts: String
});

// ✅ Define the model here itself
const Profile = mongoose.model("HealthRecord"); // ✅ Already declared earlier




//profile

// Fetch profile by email
app.get("/api/profile", async (req, res) => {
  try {
    const profile = await Profile.findOne({ email: req.query.email });
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update profile by email
app.put("/api/profile", async (req, res) => {
  try {
    const updated = await Profile.findOneAndUpdate(
      { email: req.body.email },
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


app.listen(3001, () => {
    console.log("server is running");
});





// https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=23QFGY&scope=activity+cardio_fitness+electrocardiogram+heartrate+irregular_rhythm_notifications+location+nutrition+oxygen_saturation+profile+respiratory_rate+settings+sleep+social+temperature+weight&code_challenge=Y7ABIaOIsqE9YrmiotI7mWV4nK5NengS0zvLAby6tz8&code_challenge_method=S256&state=435d2x671t0n050e3s1r5a0k5n692w0fs