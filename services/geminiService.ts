
import { GoogleGenAI } from "@google/genai";

// Always use named parameter and direct process.env.API_KEY reference as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getMissionBriefing = async (level: number): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a military commander in a sci-fi space war. Level is ${level}. Provide a short, intense mission briefing (max 3 sentences) for a pilot about to enter combat. Focus on the enemy fleet and the stakes.`,
    });
    return response.text || "Commander: Pilot, we have hostiles in sector 7. Engage and eliminate. Good luck.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Commander: Communication link unstable. Standard protocols apply. Clean the sector.";
  }
};

export const getRadioChatter = async (score: number, level: number): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `A pilot is in mid-combat. Score: ${score}, Level: ${level}. Provide one short line of radio chatter from either the commander, a wingman, or an enemy taunt. Be brief.`,
    });
    return response.text || "Wingman: I'm right behind you!";
  } catch (error) {
    return "Base: Keep up the fire!";
  }
};

export const getBossAnnouncement = async (level: number): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Level ${level} boss is appearing. Give it a fearsome name and a one-sentence warning.`,
    });
    return response.text || "WARNING: HEAVY SIGNATURE DETECTED. BATTLESTATIONS!";
  } catch (error) {
    return "WARNING: BOSS INBOUND!";
  }
};
