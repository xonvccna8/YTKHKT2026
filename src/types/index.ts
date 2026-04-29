export interface IdeaScore {
  novelty: number;
  creativity: number;
  feasibility: number;
  realWorldImpact: number;
  sustainability: number;
  presentationPotential: number;
  total: number;
}

export interface Idea {
  id: string;
  title: string;
  mainField: string;
  subFields: string[];
  problem: string;
  shortDescription: string;
  novelty: string;
  mechanism: string;
  targetUsers: string;
  requiredResources: string[];
  difficulty: string;
  educationLevelFit: string;
  prototypeOrExperiment: string;
  measurementMethod: string;
  risksAndLimits: string;
  futurePotential: string;
  scores: IdeaScore;
}

export interface Top3Idea {
  rank: number;
  ideaId: string;
  reason: string;
  strongestPoint: string;
  riskToImprove: string;
}

export interface GenerateResult {
  ideas: Idea[];
  top3: Top3Idea[];
}

export interface HistoryRecord {
  id: string;
  createdAt: string;
  inputData: any;
  result: GenerateResult;
  aiMode: string;
  modelUsed: string;
}
