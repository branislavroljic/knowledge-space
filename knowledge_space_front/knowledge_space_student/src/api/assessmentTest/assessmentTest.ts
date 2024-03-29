import { get, post } from "@api/utils";

const baseUrlWithSlash = new URL(
  "assessment_tests/",
  import.meta.env.VITE_API_URL
);

export type AssessmentTest = {
  id: number;
  name: string;
  completed: boolean;
  totalNumOfAnswers?: number;
  numOfCorrectAnswers?: number;
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

export type AssessmentTestResult = {
  total: number;
  correct: number;
};

export type UserAssessmentTest = {
  assessmentTestId: number;
  answers: number[];
};

export function getAssessmentTests(): Promise<AssessmentTest[]> {
  return get(new URL("by_user", baseUrlWithSlash));
}

export function getAssessmentTestQuestions(id: number): Promise<Question[]> {
  return get(new URL("" + id, baseUrlWithSlash));
}

export function submitAssessmentTest(input: UserAssessmentTest) {
  return post(
    new URL("" + input.assessmentTestId, baseUrlWithSlash),
    JSON.stringify(input.answers)
  );
}
