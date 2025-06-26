import React, { useState } from "react";
import "../styles/SymptomChecker.css";

function SymptomChecker() {
  const [symptoms, setSymptoms] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("http://localhost:3001/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setResult({ error: data.error });
      }
    } catch (err) {
      setResult({ error: "Network error occurred." });
    }

    setLoading(false);
  };

  return (
    <div className="m-flex m-flex-col m-items-center m-justify-center m-min-h-screen m-font-sans m-bg-gray-100 m-px-4">
      <div className="m-w-full m-max-w-xl">
        {/* <image src="../assets/scope.png"/>  */}

        <h1 className="m-text-3xl m-font-bold m-text-center m-text-purple-700 m-mb-6" id="title-symptom">
          🩺 Symptom Checker
        </h1>

        <form onSubmit={handleSubmit} className="m-mb-4 m-flex m-flex-col m-items-center">
          <textarea
            className="m-w-full md:m-w-3/4 lg:m-w-2/3 m-p-2 m-border m-rounded m-mb-2 m-text-center"
            rows="4"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="Enter your symptoms (e.g., fever, cough, fatigue)"
          />
          <button
            type="submit"
            className="m-bg-purple-600 m-text-white m-px-4 m-py-2 m-rounded m-hover:bg-purple-700"
          >
            {loading ? "Analyzing..." : "Submit"}
          </button>
        </form>

        {result && !result.error && (
          <div className="m-result-grid m-animate-fade-in">
            {["info", "precaution", "diet", "medication"].map((section) => (
              <div key={section} className="m-result-card">
                <h2
                  className="m-result-title"
                  data-icon={
                    section === "info"
                      ? "ℹ️"
                      : section === "precaution"
                      ? "🛡️"
                      : section === "diet"
                      ? "🥗"
                      : section === "medication"
                      ? "💊"
                      : ""
                  }
                >
                  {section}
                </h2>
                <p>{result[section]}</p>
              </div>
            ))}
          </div>
        )}

        {result?.error && (
          <div className="m-bg-red-100 m-text-red-700 m-p-4 m-rounded m-mt-4">
            <p>
              <strong>Error:</strong> {result.error}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SymptomChecker;
