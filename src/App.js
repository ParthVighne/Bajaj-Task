import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [jsonInput, setJsonInput] = useState(""); // Input JSON
  const [error, setError] = useState(""); // Validation error
  const [response, setResponse] = useState(null); // API response
  const [selectedOptions, setSelectedOptions] = useState([]); // Dropdown selections

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate JSON input
    try {
      const parsedInput = JSON.parse(jsonInput);
      if (!parsedInput.data) {
        throw new Error("JSON must contain a 'data' field.");
      }

      // Call the backend API
      const apiResponse = await axios.post(
        "/api/index",
        parsedInput
      );
      setResponse(apiResponse.data);
    } catch (err) {
      setError("Invalid JSON format or missing 'data' field.");
    }
  };

  // Handle multi-select dropdown change
  const handleDropdownChange = (e) => {
    const options = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setSelectedOptions(options);
  };

  return (
    <div className="App">
      <h1>BFHL Frontend</h1>
      <h2>Roll Number: 0002CB211038</h2>

      {/* JSON Input Form */}
      <form onSubmit={handleSubmit}>
        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder='Enter JSON here (e.g., { "data": ["A", "B", "C"] })'
          rows="6"
          cols="50"
        ></textarea>
        <br />
        <button type="submit">Submit</button>
      </form>

      {/* Error Message */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Multi-Select Dropdown */}
      {response && (
        <div>
          <label htmlFor="options">Select Fields to Display:</label>
          <select
            id="options"
            multiple
            value={selectedOptions}
            onChange={handleDropdownChange}
          >
            <option value="alphabets">Alphabets</option>
            <option value="numbers">Numbers</option>
            <option value="highest_lowercase_alphabet">
              Highest Lowercase Alphabet
            </option>
          </select>
        </div>
      )}

      {/* Render Response Based on Dropdown Selections */}
      {response && (
        <div>
          <h3>Response:</h3>
          <ul>
            {selectedOptions.includes("alphabets") && (
              <li>
                <strong>Alphabets:</strong> {JSON.stringify(response.alphabets)}
              </li>
            )}
            {selectedOptions.includes("numbers") && (
              <li>
                <strong>Numbers:</strong> {JSON.stringify(response.numbers)}
              </li>
            )}
            {selectedOptions.includes("highest_lowercase_alphabet") && (
              <li>
                <strong>Highest Lowercase Alphabet:</strong>{" "}
                {JSON.stringify(response.highest_lowercase_alphabet)}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
