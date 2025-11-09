
import { GoogleGenAI, Modality, Type } from "@google/genai";
import { ConversionSettings, TextAnalysis, TextFileFormat } from '../types';

if (!process.env.API_KEY) {
    // This is a placeholder check. In a real environment, the key is expected to be set.
    // In this specific execution environment, process.env.API_KEY is pre-configured.
    console.warn("API_KEY environment variable not set. Using a placeholder.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export async function convertImage(
    base64Image: string, 
    mimeType: string, 
    settings: ConversionSettings
): Promise<string> {
    
    const prompt = `You are an expert image processor. Convert this image to ${settings.format}. The target quality is ${settings.quality} on a scale from 1 to 100, where 100 is the highest quality. Respond ONLY with the converted image. Do not include any text, preamble, or explanation.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: base64Image,
                            mimeType: mimeType,
                        },
                    },
                    {
                        text: prompt,
                    },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        // Find the image part in the response
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return part.inlineData.data;
            }
        }
        
        throw new Error("The AI model did not return an image. Please try again.");

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        if (error instanceof Error) {
            throw new Error(`Gemini API Error: ${error.message}`);
        }
        throw new Error("An unknown error occurred while communicating with the Gemini API.");
    }
}

export async function convertFile(
    content: string,
    fromFormat: TextFileFormat,
    toFormat: TextFileFormat
): Promise<string> {
    const prompt = `You are an expert file format converter. Convert the following content from ${fromFormat.toUpperCase()} to ${toFormat.toUpperCase()}.
Respond ONLY with the converted content. Do not include any text, preamble, explanation, or code block fences like \`\`\`.

Input content:
---
${content}
---`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        if (error instanceof Error) {
            throw new Error(`Gemini API Error: ${error.message}`);
        }
        throw new Error("An unknown error occurred while communicating with the Gemini API.");
    }
}

export async function analyzeText(text: string): Promise<TextAnalysis> {
    const prompt = `You are a text analysis expert. Analyze the following text.
Text to analyze:
---
${text}
---
`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        charCount: { type: Type.INTEGER, description: 'Total number of characters including spaces.' },
                        wordCount: { type: Type.INTEGER, description: 'Total number of words.' },
                        sentenceCount: { type: Type.INTEGER, description: 'Total number of sentences.' },
                        paragraphCount: { type: Type.INTEGER, description: 'Total number of paragraphs.' },
                        readingTimeSeconds: { type: Type.INTEGER, description: 'Estimated reading time in seconds for an average reader.' },
                        summary: { type: Type.STRING, description: 'A concise, one-paragraph summary of the text.' },
                        keywords: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: 'A list of the most relevant keywords or topics.'
                        },
                        sentiment: {
                            type: Type.STRING,
                            description: 'The overall sentiment of the text. One of: "positive", "negative", "neutral", "mixed".'
                        }
                    },
                    required: ['charCount', 'wordCount', 'sentenceCount', 'paragraphCount', 'readingTimeSeconds', 'summary', 'keywords', 'sentiment']
                }
            }
        });

        const jsonStr = response.text.trim();
        return JSON.parse(jsonStr) as TextAnalysis;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        if (error instanceof Error) {
            throw new Error(`Gemini API Error: ${error.message}`);
        }
        throw new Error("An unknown error occurred while communicating with the Gemini API.");
    }
}
