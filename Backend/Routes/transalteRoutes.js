const express = require("express");
const router = express.Router();
require("dotenv").config({ path: "../.env" });

const axios = require("axios");

// HuggingFace-based API
async function autoDetectAndTranslate(text, targetLanguage) {
  try {
    const prompt = `
Detect the language even if written in English letters (Hinglish, Tanglish, Bhojpuri).
Transliterate to native script if needed.
Translate accurately to ${targetLanguage}.
Return ONLY the translated text.

Text: "${text}"
`;

    const response = await axios.post(
      "https://api-inference.huggingface.co/models/google/mt5-small",
      { inputs: prompt },
      {
        headers: {
          Authorization: `Bearer ${process.env.TRANSLATE_API}`,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    // HF response format
    const translated = response.data?.[0]?.generated_text || text;

    return translated;
  } catch (error) {
    console.error("Translation error:", error.message);
    return text; // fallback for chat
  }
}

router.post("/", async (req, res) => {
  const { text, selectedLanguage } = req.body;

  if (!text || !selectedLanguage) {
    return res
      .status(400)
      .json({ error: "Text and targetLanguage are required" });
  }

  try {
    const translation = await autoDetectAndTranslate(text, selectedLanguage);

    res.json({ translatedText: translation });
  } catch (error) {
    console.error("Error during translation:", error);
    res.status(500).json({ error: "Error during translation" });
  }
});

module.exports = router;
