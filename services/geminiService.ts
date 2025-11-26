
import { GoogleGenAI, Type } from "@google/genai";
import { ReactionPrediction, GeneratedMolecule, SynthesisPlan, ToxicityReport, PropertyReport } from '../types';

// In a real application, you would initialize the Gemini client.
// The API_KEY is expected to be set in the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const reactionPredictionSchema = {
    type: Type.OBJECT,
    properties: {
        products: {
            type: Type.ARRAY,
            description: "An array of product molecules and their yields.",
            items: {
                type: Type.OBJECT,
                properties: {
                    molecule: {
                        type: Type.STRING,
                        description: "The chemical name of the product molecule.",
                    },
                    mol_string: {
                        type: Type.STRING,
                        description: "The SMILES string for the product molecule structure.",
                    },
                    yield: {
                        type: Type.NUMBER,
                        description: "The predicted yield of the product as a percentage (e.g., 95 for 95%).",
                    },
                },
                required: ["molecule", "mol_string", "yield"],
            },
        },
        conditions: {
            type: Type.STRING,
            description: "The optimal reaction conditions (e.g., temperature, catalyst).",
        },
        confidenceScore: {
            type: Type.NUMBER,
            description: "A score from 0 to 100 indicating the model's confidence in the prediction.",
        },
    },
    required: ["products", "conditions", "confidenceScore"],
};

const generatedMoleculeSchema = {
    type: Type.OBJECT,
    properties: {
        name: {
            type: Type.STRING,
            description: "The IUPAC or common name of the generated molecule."
        },
        mol_string: {
            type: Type.STRING,
            description: "The Canonical SMILES string for the generated molecule's structure."
        }
    },
    required: ["name", "mol_string"],
};

const synthesisPlanSchema = {
    type: Type.OBJECT,
    properties: {
        target: {
            type: Type.STRING,
            description: "The name of the target molecule.",
        },
        routes: {
            type: Type.ARRAY,
            description: "A list of distinct synthesis routes.",
            items: {
                type: Type.OBJECT,
                properties: {
                    routeId: { type: Type.STRING, description: "A unique identifier for the route (e.g., Route A, Route B)." },
                    summary: { type: Type.STRING, description: "A brief summary of this specific route strategy." },
                    difficulty: { type: Type.NUMBER, description: "Estimated difficulty score (0-100)." },
                    cost: { type: Type.STRING, description: "Estimated cost range (e.g., Low, Medium, High)." },
                    steps: {
                        type: Type.ARRAY,
                        description: "The sequence of reaction steps for this route.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                step: { type: Type.NUMBER, description: "The step number." },
                                description: { type: Type.STRING, description: "A description of this reaction step."},
                                reactants: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of reactant names for this step."},
                                reagents: { type: Type.STRING, description: "Reagents, catalysts, and conditions for this step."},
                                product: { type: Type.STRING, description: "The name of the product from this step."},
                                product_smiles: { type: Type.STRING, description: "The Canonical SMILES string for the product molecule structure."}
                            },
                            required: ["step", "description", "reactants", "reagents", "product", "product_smiles"]
                        }
                    }
                },
                required: ["routeId", "summary", "difficulty", "cost", "steps"]
            }
        }
    },
    required: ["target", "routes"],
};

const toxicityReportSchema = {
    type: Type.OBJECT,
    properties: {
        moleculeName: { type: Type.STRING, description: "The identified name of the molecule being analyzed."},
        summary: { type: Type.STRING, description: "A high-level summary of the toxicology profile."},
        oralToxicity: { type: Type.STRING, description: "Predicted oral toxicity (e.g., LD50, toxicity class). Provide reasoning."},
        dermalToxicity: { type: Type.STRING, description: "Predicted dermal toxicity and irritation potential."},
        carcinogenicity: { type: Type.STRING, description: "Assessment of carcinogenic potential based on structural alerts and known data."},
        mutagenicity: { type: Type.STRING, description: "Assessment of mutagenic potential (e.g., Ames test prediction)."},
        safetyPrecautions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Recommended personal protective equipment (PPE) and handling precautions."},
        riskScore: { type: Type.NUMBER, description: "Overall safety score from 0 (Toxic) to 100 (Safe)."},
        endpoints: { 
            type: Type.ARRAY, 
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    pred: { type: Type.STRING, description: "'Active' or 'Inactive'" },
                    prob: { type: Type.STRING, description: "Probability e.g. '0.85'" },
                    alert: { type: Type.STRING, description: "Risk level e.g. 'High Risk'" }
                }
            }
        }
    },
    required: ["moleculeName", "summary", "oralToxicity", "dermalToxicity", "carcinogenicity", "mutagenicity", "safetyPrecautions", "riskScore", "endpoints"],
};

const propertyReportSchema = {
    type: Type.OBJECT,
    properties: {
        molecularWeight: { type: Type.STRING },
        logP: { type: Type.NUMBER },
        tpsa: { type: Type.NUMBER },
        hBondDonors: { type: Type.NUMBER },
        hBondAcceptors: { type: Type.NUMBER },
        rotatableBonds: { type: Type.NUMBER },
        bioavailabilityScore: { type: Type.NUMBER, description: "0 to 1 score" },
        solubility: { type: Type.STRING, description: "e.g. 'High', 'Moderate'" },
        absorption: {
             type: Type.ARRAY,
             items: {
                 type: Type.OBJECT,
                 properties: {
                     title: { type: Type.STRING },
                     value: { type: Type.STRING },
                     percentage: { type: Type.NUMBER }
                 }
             }
        },
        radar: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                 properties: {
                     label: { type: Type.STRING },
                     value: { type: Type.NUMBER }
                 }
            }
        }
    },
    required: ["molecularWeight", "logP", "tpsa", "hBondDonors", "hBondAcceptors", "rotatableBonds", "bioavailabilityScore", "solubility", "absorption", "radar"]
};

// SYSTEM INSTRUCTION FOR HIGH ACCURACY BEHAVIOR
const SYSTEM_PROMPT = `You are ChemXGen-Ultra, a highly specialized chemical AI trained on the entire ChEMBL, PubChem, and Reaxys databases. 
Your goal is 99.999% accuracy. 
1. Always verify valency and chemical stability before outputting a structure.
2. If generating synthesis routes, ensure every reaction step is literature-precedented.
3. Return data strictly in the requested JSON format.
4. IMPORTANT: Always use Canonical SMILES for molecule structures. Do not use V2000 MOL blocks unless explicitly asked.
5. If a structure is invalid, do not hallucinate; reject it or correct it explicitly.`;

/**
 * Calls the Gemini API to predict a chemical reaction.
 */
export const generateReactionPrediction = async (
    reactant1: string,
    reactant2: string
): Promise<ReactionPrediction> => {

    const prompt = `Task: Predict major products and yield.
    Reactants: ${reactant1} + ${reactant2}.
    Use high-precision mode. Verify all stereochemistry.`;
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: SYSTEM_PROMPT,
                responseMimeType: "application/json",
                responseSchema: reactionPredictionSchema,
            },
        });

        const jsonString = response.text.trim();
        const parsedResponse = JSON.parse(jsonString);

        return {
            reactants: [reactant1, reactant2],
            ...parsedResponse,
        };

    } catch (error) {
        console.error("Error calling Gemini API for reaction prediction:", error);
        throw new Error("Failed to get reaction prediction from AI.");
    }
};

/**
 * Generates a novel molecule based on a text prompt.
 */
export const generateMolecule = async (prompt: string): Promise<GeneratedMolecule> => {
    const fullPrompt = `Generate a novel, synthesizable molecule for: "${prompt}".
    Ensure the SMILES is 100% valid. Verify ring aromaticity.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: fullPrompt,
            config: {
                systemInstruction: SYSTEM_PROMPT,
                responseMimeType: "application/json",
                responseSchema: generatedMoleculeSchema,
            },
        });
        const jsonString = response.text.trim();
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Error calling Gemini API for molecule generation:", error);
        throw new Error("Failed to generate molecule from AI.");
    }
};

/**
 * Generates a multi-step synthesis plan for a target molecule.
 */
export const planSynthesis = async (targetMolecule: string, numRoutes: number = 5): Promise<SynthesisPlan> => {
    // Determine if input is SMILES or Name or other. 
    // The model is smart enough to handle mixed input in the prompt, but asking for output as SMILES is key.
    
    const prompt = `Devise ${numRoutes} distinct, high-confidence retrosynthesis routes for:
    ${targetMolecule}
    
    Constraint: Max 4 steps per route.
    Requirement: Return 'product_smiles' for every step. Ensure all SMILES are chemically valid string representations.
    Optimize for: Cost and Yield.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash", 
            contents: prompt,
            config: {
                systemInstruction: SYSTEM_PROMPT,
                responseMimeType: "application/json",
                responseSchema: synthesisPlanSchema,
            },
        });
        const jsonString = response.text.trim();
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Error calling Gemini API for synthesis planning:", error);
        throw new Error("Failed to generate synthesis plan from AI.");
    }
};

/**
 * Analyzes a molecule for its toxicology profile.
 */
export const analyzeToxicity = async (molString: string): Promise<ToxicityReport> => {
    const prompt = `Perform a deep toxicology assessment on:
    ${molString}
    
    Cross-reference structural alerts (PAINS, Brenk). Estimate LD50. Return high-confidence risk scores.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: SYSTEM_PROMPT,
                responseMimeType: "application/json",
                responseSchema: toxicityReportSchema,
            },
        });
        const jsonString = response.text.trim();
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Error calling Gemini API for toxicology analysis:", error);
        throw new Error("Failed to analyze toxicity from AI.");
    }
};

/**
 * Analyzes a molecule for its physicochemical properties (ADMET).
 */
export const analyzeProperties = async (molString: string): Promise<PropertyReport> => {
    const prompt = `Calculate ADMET properties for:
    ${molString}
    
    Precision: High. Ensure LogP and TPSA conform to Lipinski's Rule of 5 validation.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: SYSTEM_PROMPT,
                responseMimeType: "application/json",
                responseSchema: propertyReportSchema,
            },
        });
        const jsonString = response.text.trim();
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Error calling Gemini API for property analysis:", error);
        throw new Error("Failed to analyze properties from AI.");
    }
};
