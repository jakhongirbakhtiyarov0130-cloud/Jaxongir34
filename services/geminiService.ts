
import { GoogleGenAI, Type } from "@google/genai";
import { ConversionResult } from "../types";

export const analyzeSheetMusic = async (base64DataUrl: string): Promise<ConversionResult> => {
  // Yangi instance yaratish (har doim yangi kalit bilan ishlash uchun)
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const mimeTypeMatch = base64DataUrl.match(/^data:(.*);base64,(.*)$/);
  if (!mimeTypeMatch) {
    throw new Error("Rasm formati noto'g'ri yoki fayl buzilgan.");
  }
  const mimeType = mimeTypeMatch[1];
  const base64Data = mimeTypeMatch[2];

  const prompt = `
    Analyze this sheet music image and perform high-quality Optical Music Recognition (OMR).
    Convert the entire visible music into a VALID and COMPLETE MusicXML string.
    
    IMPORTANT:
    - Include all details: clef, key signature, time signature, notes, durations, rests, and measure bars.
    - If there are multiple measures, include all of them.
    - The output must be a single string containing the XML code in the 'musicXml' field.
    - Provide a concise summary of the piece (e.g., "G major, 4/4 time, for Saxophone") in the 'summary' field in Uzbek.
  `;

  const imagePart = {
    inlineData: {
      mimeType: mimeType,
      data: base64Data,
    },
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: { parts: [imagePart, { text: prompt }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            musicXml: {
              type: Type.STRING,
              description: "The full valid MusicXML string including all measures.",
            },
            summary: {
              type: Type.STRING,
              description: "Short summary in Uzbek.",
            },
          },
          required: ["musicXml", "summary"],
        },
        temperature: 0.1,
        // MusicXML fayllari juda uzun bo'lishi mumkin, shuning uchun token limitni oshiramiz
        maxOutputTokens: 12000,
        thinkingConfig: { thinkingBudget: 4000 }
      },
    });

    const textResponse = response.text;
    if (!textResponse) {
      throw new Error("AI dan hech qanday javob kelmadi. Rasm sifatini tekshiring.");
    }

    const result = JSON.parse(textResponse);

    if (!result.musicXml || result.musicXml.length < 50) {
      throw new Error("Notalarni to'liq aniqlab bo'lmadi. Iltimos, aniqroq rasm yuklang.");
    }

    return {
      xmlContent: result.musicXml,
      summary: result.summary || "Musiqa muvaffaqiyatli tahlil qilindi.",
    };
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    if (error.message?.includes("fetch")) {
      throw new Error("Internet aloqasi yoki API xizmatida uzilish. Iltimos, qaytadan urinib ko'ring.");
    }
    
    if (error.message?.includes("safety") || error.message?.includes("blocked")) {
      throw new Error("Rasm xavfsizlik filtri tomonidan bloklandi. Faqat musiqa notalarini yuklang.");
    }

    throw new Error(error.message || "Tahlil jarayonida kutilmagan xatolik yuz berdi.");
  }
};
