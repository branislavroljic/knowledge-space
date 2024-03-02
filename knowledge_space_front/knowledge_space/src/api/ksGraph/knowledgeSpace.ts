import {
  Page,
  PageRequest,
  SelectInput,
  addPaginationParams,
  get,
} from "@api/utils";

const baseUrl = new URL("ks", import.meta.env.VITE_API_URL);
const baseUrlWithSlash = new URL("ks/", import.meta.env.VITE_API_URL);

export type KnowledgeSpace = SelectInput & {
  assessmentTest?: string;
  isReal?: boolean;
};

export type AssessmentTest = SelectInput & {
  knowledgeSpace: string;
};

export type Report = {
  xvalue: string;
  yvalue: number;
};

export function getKnowledgeSpaces(): Promise<KnowledgeSpace[]> {
  return get(new URL("all", baseUrlWithSlash));
}

export function getPaginatedKnowledgeSpaces(
  pagination: PageRequest
): Promise<Page<KnowledgeSpace>> {
  return get(addPaginationParams(baseUrl, pagination));
}

export function generateRealKnowledgeSpace(assessmentTestId: number) {
  return get(new URL("real_ks/generate/" + assessmentTestId, baseUrlWithSlash));
}

export function getAssessmentTests(
  pagination: PageRequest
): Promise<Page<AssessmentTest>> {
  return get(
    addPaginationParams(
      new URL("assessment_tests", baseUrlWithSlash),
      pagination
    )
  );
}

export function getAssessmentTestsForKS(
  ksId: number
): Promise<AssessmentTest[]> {
  return get(new URL(ksId + "/assessment_tests", baseUrlWithSlash));
}

export function getStatistics(assessmentTestId?: number) {
  return get(new URL("statistics/" + assessmentTestId, baseUrlWithSlash));
}
