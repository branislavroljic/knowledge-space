import { Page, PageRequest, addPaginationParams, get, post } from "@api/utils";

const baseUrl = new URL("ks/", import.meta.env.VITE_API_URL);
const assessmentTestBaseUrl = new URL(
  "assessment_tests/",
  import.meta.env.VITE_API_URL
);

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

export type StudentAssessmentTest = {
  email: string;
  id: number;
  numOfCorrectAnswers: number;
  totalNumOfAnswers: number;
};

export function createAssessmentTest(assessmentTest: AssessmentTest) {
  return post(
    new URL(assessmentTest.id + "/assessment_tests", baseUrl),
    JSON.stringify(assessmentTest)
  );
}

export function getAssessmentTestQuestions(id: number): Promise<Question[]> {
  return get(new URL("" + id, assessmentTestBaseUrl));
}

export function getKSProblems(ksId?: number): Promise<Problem> {
  return get(new URL(ksId + "/problems", baseUrl));
}

export function generateQTI(id?: number) {
  return get(new URL(id + "/imsqti", assessmentTestBaseUrl));
}

export function getAssessmentTestStudents(
  pagination: PageRequest,
  id?: number
): Promise<Page<StudentAssessmentTest>> {
  return get(
    addPaginationParams(
      new URL(id + "/students", assessmentTestBaseUrl),
      pagination
    )
  );
}
