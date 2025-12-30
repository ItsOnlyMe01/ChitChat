const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config({ path: "../.env" });

function normalizeLanguage(lang) {
  if (!lang) return "English";

  const map = {
    hi: "Hindi",
    hindi: "Hindi",
    ta: "Tamil",
    tamil: "Tamil",
    en: "English",
    english: "English",
    bhojpuri: "Bhojpuri",
    bn: "Bengali",
    te: "Telugu",
    mr: "Marathi",
  };

  return map[lang.toLowerCase()] || "English";
}

async function autoDetectAndTranslate(text, targetLanguage) {
  try {
    const safeLang = normalizeLanguage(targetLanguage);

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content:
              "You are a translator for Indian languages. You understand Hinglish, Bhojpuri, Tanglish written in English letters.",
          },
          {
            role: "user",
            content: `Translate the following message into ${safeLang}. 
If it is already in ${safeLang}, return it unchanged.

Message: "${text}"`,
          },
        ],
        temperature: 0.2,
        max_tokens: 100,
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
    console.error("Groq translation error:", err.response?.data || err.message);
    return text;
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
