
import { GoogleGenAI, Modality, Part, GenerateContentResponse } from '@google/genai';
import type { GeminiResponse } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = 'gemini-2.5-flash-image-preview';

function getMimeType(base64: string): string {
    if (base64.startsWith('/9j/')) return 'image/jpeg';
    if (base64.startsWith('iVBORw0KGgo=')) return 'image/png';
    if (base64.startsWith('UklGR')) return 'image/webp';
    return 'image/jpeg'; // Default
}

async function processApiResponse(response: GenerateContentResponse): Promise<GeminiResponse> {
    const result: GeminiResponse = { image: null, text: null };
    
    if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData && part.inlineData.data) {
                result.image = part.inlineData.data;
            } else if (part.text) {
                result.text = part.text;
            }
        }
    }

    return result;
}

export const generateTryOnImage = async (
    userImageBase64: string,
    outfitImageBase64: string,
    prompt: string
): Promise<GeminiResponse> => {
    
    const userImagePart: Part = {
        inlineData: {
            data: userImageBase64,
            mimeType: getMimeType(userImageBase64),
        },
    };

    const outfitImagePart: Part = {
        inlineData: {
            data: outfitImageBase64,
            mimeType: getMimeType(outfitImageBase64),
        },
    };

    const textPart: Part = { text: prompt };

    const response = await ai.models.generateContent({
        model,
        contents: {
            parts: [userImagePart, outfitImagePart, textPart],
        },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });

    return processApiResponse(response);
};

export const refineGeneratedImage = async (
    imageBase64: string,
    prompt: string
): Promise<GeminiResponse> => {
    
    const imagePart: Part = {
        inlineData: {
            data: imageBase64,
            mimeType: 'image/png', // Assume generated images are PNG
        },
    };

    const textPart: Part = { text: prompt };

    const response = await ai.models.generateContent({
        model,
        contents: {
            parts: [imagePart, textPart],
        },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });
    
    return processApiResponse(response);
};
