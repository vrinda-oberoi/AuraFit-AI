const { GoogleGenAI } = require("@google/genai");
const { normalizeVisionData } = require("./normalizer.service");

let client;

const getClient = () => {
  if (!client) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not set in environment variables");
    }

    client = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
  }

  return client;
};

const PROMPT = `You are a fashion vision AI. Analyze the clothing item in the provided image.
Return ONLY valid JSON, with no markdown formatting, no code fences, and no explanation text.
The JSON must strictly follow this exact structure and key names:

{
  "category": "",
  "subCategory": "",
  "colors": [],
  "pattern": "",
  "fabric": "",
  "sleeve": "",
  "neck": "",
  "fit": "",
  "length": "",
  "style": "",
  "brand": "",
  "description": "",
  "confidence": 0
}

Rules:
- "colors" must be an array of strings.
- "confidence" must be a number between 0 and 1 representing your confidence in this analysis.
- If a field cannot be determined, use an empty string "" (or empty array [] for colors), not null.
- Do not include any text before or after the JSON object.`;

const fetchImageAsBase64 = async (imageUrl) => {
  const response = await fetch(imageUrl);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch image from URL: ${response.status} ${response.statusText}`
    );
  }

  const contentType = response.headers.get("content-type") || "image/jpeg";
  const arrayBuffer = await response.arrayBuffer();
  const base64Data = Buffer.from(arrayBuffer).toString("base64");

  return { base64Data, mimeType: contentType };
};

const stripMarkdownFences = (text) => {
  if (!text) return text;

  let cleaned = text.trim();

  cleaned = cleaned.replace(/^```json\s*/i, "");
  cleaned = cleaned.replace(/^```\s*/, "");
  cleaned = cleaned.replace(/```$/, "");

  return cleaned.trim();
};

const safeParseJson = (rawText) => {
  const cleaned = stripMarkdownFences(rawText);

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    throw new Error(
      `Failed to parse Gemini response as JSON: ${error.message}. Raw response: ${rawText}`
    );
  }
};

const analyzeClothingImage = async (imageUrl) => {
  if (!imageUrl || typeof imageUrl !== "string") {
    throw new Error("analyzeClothingImage requires a valid imageUrl string");
  }

  let base64Data;
  let mimeType;

  try {
    const imageData = await fetchImageAsBase64(imageUrl);
    base64Data = imageData.base64Data;
    mimeType = imageData.mimeType;
  } catch (error) {
    throw new Error(`Failed to load image for analysis: ${error.message}`);
  }

  const ai = getClient();

  let result;
  try {
    result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
       config: {
        temperature: 0.1,
        responseMimeType: "application/json",
    },
      contents: [
        {
          role: "user",
          parts: [
            { text: PROMPT },
            {
              inlineData: {
                mimeType,
                data: base64Data,
              },
            },
          ],
        },
      ],
    });
  } catch (error) {
    throw new Error(`Gemini Vision API request failed: ${error.message}`);
  }

 const rawText =
  result?.text ||
  result?.response?.text?.();

if (!rawText) {
  throw new Error("Gemini returned an empty response");
}


  const parsed = safeParseJson(rawText);
  const normalized = normalizeVisionData(parsed);

  return normalized;
};

module.exports = {
  analyzeClothingImage,
};