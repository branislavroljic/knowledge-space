import { get } from "@api/utils";

const baseUrl = new URL("assessment_tests", import.meta.env.VITE_API_URL);
const baseUrlWithSlash = new URL(
  "assessment_tests/",
  import.meta.env.VITE_API_URL
);

export type AssessmentTest = {
  id: number;
  name: string;
  completed: boolean;
};

export type Question = {
  id: number;
  title: string;
  responses: Response[];
};

export type Response = {
  id: number;
  title: string;
  questionId: number;
  correct: boolean;
};

export function getAssessmentTests(): Promise<AssessmentTest[]> {
  return get(baseUrl);
}

export function getAssessmentTestQuestions(id: number): Promise<Question[]> {
  return get(new URL("" + id, baseUrlWithSlash));
}
