import { get, post } from "@api/utils";

const baseUrl = new URL("ks/", import.meta.env.VITE_API_URL);

export type AssessmentTest = {
  id?: number;
  name: string;
  questions: Question[];
};

export type Question = {
  problemId: number;
  title: string;
  responses: Response[];
};

export type Response = {
  title: string;
  correct: boolean;
};

export type Problem = {
  id?: number;
  name: string;
};

export function createAssessmentTest(assessmentTest: AssessmentTest) {
  return post(
    new URL(assessmentTest.id + "/assessment_tests", baseUrl),
    JSON.stringify(assessmentTest)
  );
}

export function getKSProblems(ksId?: number): Promise<Problem> {
  return get(new URL(ksId + "/problems", baseUrl));
}
