export type SkillCategory = 'planning' | 'coding' | 'testing' | 'review' | 'utility' | 'custom';

export interface SkillBlockTemplate {
  id: string;
  label: string;
  category: SkillCategory;
  description: string;
  icon: string;
  defaultInstructions: string;
}

export interface SkillNodeData extends Record<string, unknown> {
  label: string;
  category: SkillCategory;
  description: string;
  icon: string;
  instructions: string;
}

export const CATEGORY_COLORS: Record<SkillCategory, string> = {
  planning: '#f59e0b',
  coding: '#3b82f6',
  testing: '#10b981',
  review: '#ef4444',
  utility: '#8b5cf6',
  custom: '#6b7280',
};
