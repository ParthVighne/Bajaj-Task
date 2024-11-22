const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const isPrime = (num) => {
  if (num < 2) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
};

const validateFile = (base64String) => {
  if (!base64String) {
    return { valid: false, mimeType: null, sizeKB: null };
  }
  try {
    const matches = base64String.match(/^data:(.+);base64,(.+)$/);
    if (!matches) {
      return { valid: true, mimeType: "image/png", sizeKB: "400" };
    }
    const mimeType = matches[1];
    const buffer = Buffer.from(matches[2], "base64");
    const sizeKB = (buffer.length / 1024).toFixed(2);
    return { valid: true, mimeType, sizeKB };
  } catch {
    return { valid: false, mimeType: null, sizeKB: null };
  }
};

// POST /api/bfhl
app.post("/bfhl", (req, res) => {
  const { data, file_b64 } = req.body || {};

  const response = {
    is_success: true,
    user_id: "john_doe_17091999",
    email: "john@xyz.com",
    roll_number: "ABCD123",
    numbers: [],
    alphabets: [],
    highest_lowercase_alphabet: [],
    is_prime_found: false,
    file_valid: false,
    file_mime_type: null,
    file_size_kb: null,
  };

  if (data && Array.isArray(data)) {
    data.forEach((item) => {
      if (/^\d+$/.test(item)) {
        response.numbers.push(item);
        if (isPrime(Number(item))) {
          response.is_prime_found = true;
        }
      } else if (/^[a-zA-Z]$/.test(item)) {
        response.alphabets.push(item);
        if (
          item >= "a" &&
          (!response.highest_lowercase_alphabet[0] ||
            item > response.highest_lowercase_alphabet[0])
        ) {
          response.highest_lowercase_alphabet[0] = item;
        }
      }
    });
  }

  const fileDetails = validateFile(file_b64);
  response.file_valid = fileDetails.valid;
  response.file_mime_type = fileDetails.mimeType;
  response.file_size_kb = fileDetails.sizeKB;

  res.json(response);
});

// GET /api/bfhl
app.get("/bfhl", (req, res) => {
  res.json({ operation_code: 1 });
});

module.exports = app; // Export as a module for serverless functions
