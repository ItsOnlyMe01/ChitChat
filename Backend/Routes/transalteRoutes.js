const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config({ path: "../.env" });

async function autoDetectAndTranslate(text, targetLanguage) {
  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-8b-8192",
        messages: [
          {
            role: "system",
            content:
              "You are a translator for Indian languages. Detect the language even if written in English letters (Hinglish, Bhojpuri, Tanglish,Any). Transliterate to native script if needed and translate accurately.",
          },
          {
            role: "user",
            content: `Translate this text to ${targetLanguage}: "${text}"`,
          },
        ],
        temperature: 0.2,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 8000,
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (err) {
    console.error("Groq translation error:", err.message);
    return text; // chat never breaks
  }
}

router.post("/", async (req, res) => {
  const { text, selectedLanguage } = req.body;

  if (!text || !selectedLanguage) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const translatedText = await autoDetectAndTranslate(text, selectedLanguage);

  res.json({ translatedText });
});

module.exports = router;
