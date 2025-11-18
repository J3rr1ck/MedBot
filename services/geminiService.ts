import { GoogleGenAI, Type, Schema } from "@google/genai";
import { DiagnosisResult, UrgencyLevel } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: "A brief, empathetic summary of the analysis.",
    },
    urgency: {
      type: Type.STRING,
      enum: ["Low", "Medium", "High", "Emergency"],
      description: "The estimated urgency level of the condition.",
    },
    potentialConditions: {
      type: Type.ARRAY,
      description: "List of potential medical conditions matching the symptoms.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Name of the condition." },
          probability: { type: Type.STRING, description: "Estimated likelihood (High/Medium/Low)." },
          description: { type: Type.STRING, description: "Brief explanation of the condition." },
          commonSymptomsMatched: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of user symptoms that match this condition.",
          },
        },
        required: ["name", "probability", "description", "commonSymptomsMatched"],
      },
    },
    recommendedActions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of recommended next steps (e.g., 'Visit ER', 'Rest', 'Hydrate').",
    },
    questionsToAskDoctor: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of questions the user should ask their healthcare provider.",
    },
    disclaimer: {
      type: Type.STRING,
      description: "Mandatory medical disclaimer text.",
    },
  },
  required: ["summary", "urgency", "potentialConditions", "recommendedActions", "questionsToAskDoctor", "disclaimer"],
};

export const analyzeSymptoms = async (
  symptoms: string,
  images: string[]
): Promise<DiagnosisResult> => {
  
  const modelName = 'gemini-3-pro-preview';
  
  const parts: any[] = [];

  // Add images if provided
  if (images && images.length > 0) {
    for (const imageBase64 of images) {
        // Extract base64 data and mime type from data URL
        // Format: data:image/png;base64,iVBORw0KGgo...
        const matches = imageBase64.match(/^data:(.+);base64,(.+)$/);
        if (matches && matches.length === 3) {
            parts.push({
                inlineData: {
                    mimeType: matches[1],
                    data: matches[2]
                }
            });
        }
    }
  }

  // Add text prompt
  parts.push({
    text: `
      You are an expert AI medical assistant. Your goal is to analyze the provided symptoms and/or visual evidence to suggest potential medical conditions.
      
      User Symptoms: "${symptoms}"

      INSTRUCTIONS:
      1. Analyze the symptoms carefully.
      2. If images are provided, analyze visual markers (rashes, swelling, discoloration, etc.) across all images.
      3. Provide a list of 3-5 potential conditions sorted by likelihood.
      4. Assess the urgency level accurately. If symptoms suggest heart attack, stroke, severe allergic reaction, or other life-threatening issues, mark as EMERGENCY.
      5. Provide actionable non-medical advice (e.g., "Apply cold compress", "Go to the ER").
      6. ALWAYS emphasize that you are an AI and this is NOT a professional medical diagnosis.

      Format the output strictly as JSON according to the schema.
    `
  });

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: {
        parts: parts
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        systemInstruction: "You are a helpful and responsible AI medical assistant. You must always prioritize user safety and recommend professional medical help.",
        temperature: 0.3, // Lower temperature for more consistent/analytical results
      },
    });

    const text = response.text;
    if (!text) {
        throw new Error("No response generated from AI model.");
    }

    const result = JSON.parse(text) as DiagnosisResult;
    return result;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};