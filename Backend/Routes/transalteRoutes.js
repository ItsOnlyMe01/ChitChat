const express = require("express");
const router = express.Router();
require("dotenv").config({ path: "../.env" });

const { Translate } = require("@google-cloud/translate").v2;
const translate = new Translate({ key: process.env.GOOGLE_API });

async function autoDetectAndTranslate(text, targetLanguage) {
  console.log("lang is");
  console.log(targetLanguage);
  try {
    const [detection] = await translate.detect(text);
    const detectedLanguage = detection.language;
    console.log(`Detected language: ${detectedLanguage}`);

    const [translation] = await translate.translate(text, targetLanguage);
    console.log(`Translated text: ${translation}`);

    return translation;
  } catch (error) {
    console.error("Error during language detection or translation:", error);
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

    console.log(`Message translated to your language: ${translation}`);
  } catch (error) {
    console.error("Error during translation:", error);
    res.status(500).json({ error: "Error during translation" });
  }
});

module.exports = router;
