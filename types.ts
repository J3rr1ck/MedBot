export enum UrgencyLevel {
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "High",
  EMERGENCY = "Emergency"
}

export interface MedicalCondition {
  name: string;
  probability: string; // e.g. "High", "Moderate", "Low"
  description: string;
  commonSymptomsMatched: string[];
}

export interface DiagnosisResult {
  summary: string;
  urgency: UrgencyLevel;
  potentialConditions: MedicalCondition[];
  recommendedActions: string[];
  questionsToAskDoctor: string[];
  disclaimer: string;
}