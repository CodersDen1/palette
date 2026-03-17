
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, AnalyzedItem, ChatMessage, GroundingSource } from "../types";

const getAIClient = () => {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

const cleanJsonString = (text: string): string => {
    const markdownMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
    if (markdownMatch) return markdownMatch[1];
    const startObj = text.indexOf('{');
    const endObj = text.lastIndexOf('}');
    if (startObj !== -1 && endObj !== -1) {
        return text.substring(startObj, endObj + 1);
    }
    return text;
};

const extractGroundingSources = (response: any): GroundingSource[] => {
    const sources: GroundingSource[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (Array.isArray(chunks)) {
        chunks.forEach((chunk: any) => {
            if (chunk.web?.uri && chunk.web?.title) {
                sources.push({ title: chunk.web.title, uri: chunk.web.uri });
            }
        });
    }
    return sources.slice(0, 3);
};

export const detectItemsFast = async (base64Image: string): Promise<Partial<AnalyzedItem>[]> => {
    const ai = getAIClient();
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

    const prompt = `
        Scan this image for architectural finishes and furniture.
        PRIORITIZE: 
        1. Flooring (Marble, Wood, Tile, Concrete, Terrazzo)
        2. Wall Finishes (Stone cladding, Wood paneling, Wallpaper, Paint, Venetian Plaster)
        3. Stones (Countertops, Backsplashes, Accents, Slabs)
        4. Loose Furniture and Designer Lighting.
        
        Identify the specific material for each item (e.g., 'Bianco Carrara Marble Flooring', 'American Walnut Veneer Wall').
        Provide (x, y) coordinate percentages.
        Categories: Finish, Furniture, Lighting, Appliance, Decor, Vehicle, Fabric, Sanitaryware.
    `;

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: {
            parts: [
                { inlineData: { mimeType: "image/jpeg", data: cleanBase64 } },
                { text: prompt }
            ]
        },
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    items: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING },
                                category: { type: Type.STRING, enum: ["Finish", "Furniture", "Lighting", "Appliance", "Decor", "Vehicle", "Fabric", "Sanitaryware"] },
                                x: { type: Type.NUMBER },
                                y: { type: Type.NUMBER }
                            },
                            required: ["name", "category", "x", "y"]
                        }
                    }
                }
            }
        }
    });

    const parsed = JSON.parse(cleanJsonString(response.text || '{"items":[]}'));
    return parsed.items || [];
};

export const enrichItemData = async (base64Image: string, item: Partial<AnalyzedItem>): Promise<Partial<AnalyzedItem>> => {
    const ai = getAIClient();
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

    const prompt = `
        DUBAI LOCAL MARKET PROCUREMENT DOSSIER:
        Focus on the "${item.name}" at coordinate X:${item.x}%, Y:${item.y}%.
        Identify the exact material (e.g. Italian Calacatta Marble, European White Oak).
        
        MANDATORY VENDOR REQUIREMENTS:
        1. List 4 MAJOR LOCAL SHOWROOMS in Dubai, UAE (e.g. Bagno Design, Al Huzaifa, Marina Home, Obegi, Sanipex).
        2. Provide specific location in Dubai (e.g. Al Quoz, Sheikh Zayed Road, Design District).
        3. Include price estimates in AED.
    `;

    const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: {
            parts: [
                { inlineData: { mimeType: "image/jpeg", data: cleanBase64 } },
                { text: prompt }
            ]
        },
        config: {
            tools: [{ googleSearch: {} }],
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    description: { type: Type.STRING },
                    material: { type: Type.STRING },
                    quantityEstimate: { type: Type.STRING },
                    averagePrice: { type: Type.STRING },
                    searchQuery: { type: Type.STRING },
                    vendors: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING },
                                phone: { type: Type.STRING },
                                location: { type: Type.STRING },
                                priceEstimate: { type: Type.STRING }
                            }
                        }
                    },
                    similarProducts: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING },
                                brand: { type: Type.STRING },
                                price: { type: Type.STRING },
                                matchScore: { type: Type.STRING }
                            }
                        }
                    }
                }
            }
        }
    });

    const sources = extractGroundingSources(response);
    const data = JSON.parse(cleanJsonString(response.text || "{}"));
    return { ...data, groundingSources: sources };
};

export const identifyItemAtCoordinate = async (base64Image: string, x: number, y: number): Promise<Partial<AnalyzedItem>> => {
    const ai = getAIClient();
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

    const prompt = `
        ANALYZE COORDINATE: X:${x}%, Y:${y}%.
        What is the specific architectural finish or item at this spot? 
        PRIORITIZE architectural surfaces: Flooring, Wall Finishes, Stone work.
        Return the material name and 4 procurement partners in Dubai.
    `;

    const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: {
            parts: [
                { inlineData: { mimeType: "image/jpeg", data: cleanBase64 } },
                { text: prompt }
            ]
        },
        config: {
            tools: [{ googleSearch: {} }],
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    category: { type: Type.STRING },
                    description: { type: Type.STRING },
                    material: { type: Type.STRING },
                    averagePrice: { type: Type.STRING },
                    vendors: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING },
                                priceEstimate: { type: Type.STRING },
                                location: { type: Type.STRING }
                            }
                        }
                    }
                }
            }
        }
    });

    const sources = extractGroundingSources(response);
    const data = JSON.parse(cleanJsonString(response.text || "{}"));
    return { ...data, groundingSources: sources };
};

export const editInteriorImage = async (base64Image: string, promptText: string, referenceBase64?: string | null): Promise<string> => {
    // ALWAYS instantiate fresh GoogleGenAI right before call for gemini-3-pro-image-preview
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");
    
    const parts: any[] = [
        { inlineData: { mimeType: 'image/jpeg', data: cleanBase64 } }
    ];

    if (referenceBase64) {
        const cleanRef = referenceBase64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");
        parts.push({ 
            inlineData: { 
                mimeType: 'image/jpeg', 
                data: cleanRef 
            } 
        });
    }

    const systemPrompt = referenceBase64 
        ? `TASK: ARCHITECTURAL MATERIAL REPLACEMENT. 
           Source Image: The first image.
           Target Material Reference: The second image.
           INSTRUCTION: ${promptText}. 
           Modify the first image by replacing the described surfaces or objects with the exact material, color, and texture shown in the second image. 
           Preserve all lighting, architectural perspective, and shadows to ensure a seamless photorealistic edit.`
        : `TASK: ARCHITECTURAL IMAGE MODIFICATION. 
           INSTRUCTION: ${promptText}. 
           Modify the provided interior image. Maintain photorealism, perspective, and existing room lighting.`;

    parts.push({ text: systemPrompt });

    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: { parts },
        config: {
            imageConfig: {
                aspectRatio: "1:1",
                imageSize: "1K"
            }
        }
    });

    const candidate = response.candidates?.[0];
    if (!candidate) throw new Error("Neural engine did not return a valid candidate.");

    for (const part of candidate.content.parts) {
        if (part.inlineData) {
            return `data:image/png;base64,${part.inlineData.data}`;
        }
    }
    
    throw new Error("Neural generation failed to output an image part. Please try a more specific prompt.");
};

export const sendChatMessage = async (history: ChatMessage[], message: string): Promise<string> => {
    const ai = getAIClient();
    const chat = ai.chats.create({
        model: 'gemini-3-pro-preview',
        config: { systemInstruction: "You are a professional Dubai-based procurement agent specializing in luxury interior finishes." }
    });
    const response = await chat.sendMessage({ message });
    return response.text || "Unable to process request.";
};
