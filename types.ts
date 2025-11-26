
export interface User {
  id: string; // from auth.users
  email: string;
  // from profiles table
  display_name: string | null;
  photo_url: string | null;
  subscription_tier: SubscriptionTier;
  credits: number;
}

export enum SubscriptionTier {
  INDIVIDUAL = 'Individual Researcher',
  TEAM = 'Small Lab / Team',
  ENTERPRISE = 'Enterprise',
  NONE = 'None'
}

export interface Project {
  id: string;
  user_id: string;
  created_at: string;
  updated_at?: string;
  name: string;
  description: string | null;
  tag: 'AI' | 'Chemistry' | 'Research' | 'Toxicology' | 'Modeling' | null;
  preview_image_url: string | null;
  problem_statement: string | null;
  ai_method: string | null;
  outcome: string | null;
  molecule_count: number;
  reaction_count: number;
}

export interface ReactionPrediction {
  reactants: string[];
  products: { molecule: string; yield: number; mol_string: string }[];
  conditions: string;
  confidenceScore: number;
}

export interface GeneratedMolecule {
    name: string;
    mol_string: string;
}

export interface SynthesisStep {
    step: number;
    description: string;
    reactants: string[];
    reagents: string;
    product: string;
    product_smiles: string; // Changed from mol_string to smiles for reliability
}

export interface SynthesisRoute {
    routeId: string;
    summary: string;
    difficulty: number;
    cost: string;
    steps: SynthesisStep[];
}

export interface SynthesisPlan {
    target: string;
    routes: SynthesisRoute[];
}

export interface ToxicityReport {
    moleculeName: string;
    summary: string;
    oralToxicity: string;
    dermalToxicity: string;
    carcinogenicity: string;
    mutagenicity: string;
    safetyPrecautions: string[];
    riskScore?: number;
    endpoints?: { name: string; pred: string; prob: string; alert: string }[];
}

export interface PropertyReport {
    molecularWeight: string;
    logP: number;
    tpsa: number;
    hBondDonors: number;
    hBondAcceptors: number;
    rotatableBonds: number;
    bioavailabilityScore: number;
    solubility: string;
    absorption: { title: string; value: string; percentage: number }[];
    radar: { label: string; value: number }[];
}

export interface Task {
    id: string;
    molecule: string;
    status: 'running' | 'completed' | 'failed';
    type: string;
    startTime: string;
    settings?: any;
    progress?: number; // 0-100
    result?: any; // Stores the AI result (SynthesisPlan, ToxicityReport, etc.)
}
