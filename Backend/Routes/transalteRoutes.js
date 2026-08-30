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
        model: "groq/compound-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a translator for Indian languages. You understand Hinglish, Bhojpuri, Tanglish written in English letters. The input may consist of multiple messages separated by ' || '. Translate the message(s), keeping the ' || ' separators exactly intact in the output. Return ONLY the translated text, do not add any explanations, quotes, or extra words.",
          },
          {
            role: "user",
            content: `Translate the following message(s) into ${safeLang}. If there are ' || ' separators in the input, preserve them exactly in the output. Return ONLY the translated text. Do not add explanations, quotes, or extra words.

Message: ${text}`,
          },
        ],
        temperature: 0.2,
        max_tokens: 500,
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

  try {
    if (Array.isArray(text)) {
      if (text.length === 0) return res.json({ translatedText: [] });

      // Joins multiple messages with a delimiter
      const joinedText = text.join(" || ");
      const translatedJoined = await autoDetectAndTranslate(joinedText, selectedLanguage);
      
      // Splits the translated string back into an array
      const translatedArray = translatedJoined.split(" || ");

      if (translatedArray.length === text.length) {
        res.json({ translatedText: translatedArray });
      } else {
        // Fallback: If split lengths don't match, return original texts
        res.json({ translatedText: text });
      }
    } else {
      const translatedText = await autoDetectAndTranslate(text, selectedLanguage);
      res.json({ translatedText });
    }
  } catch (error) {
    console.error("Error during translation:", error);
    res.status(500).json({ error: "Error during translation" });
  }
});

module.exports = router;
