import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || ''; 

// Initialize the client safely. If no key, we'll handle it in the function.
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateProcedureNotes = async (keywords: string, procedureType: string): Promise<string> => {
  if (!ai) {
    console.warn("API Key missing for Gemini.");
    return "Chave de API não configurada. Adicione sua chave para usar a IA.";
  }

  try {
    const prompt = `
      Você é um assistente para uma esteticista profissional.
      Crie um registro técnico e profissional do procedimento realizado.
      Use linguagem formal e técnica adequada à área de estética.
      Seja conciso (máximo 3 frases).
      
      Procedimento: ${procedureType}
      Detalhes/Observações brutas: ${keywords}
      
      Saída apenas do texto do registro.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text?.trim() || "Não foi possível gerar o resumo.";
  } catch (error) {
    console.error("Error generating notes:", error);
    return "Erro ao conectar com a IA.";
  }
};

export const suggestPostCare = async (procedureType: string): Promise<string> => {
  if (!ai) return "API Key missing.";
  
  try {
     const prompt = `
      Liste 3 cuidados pós-procedimento essenciais para: ${procedureType}.
      Formato: Lista simples com hífens. Tom amigável e instrutivo para o cliente.
    `;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });
    
    return response.text?.trim() || "";
  } catch (e) {
      console.error(e);
      return "";
  }
}