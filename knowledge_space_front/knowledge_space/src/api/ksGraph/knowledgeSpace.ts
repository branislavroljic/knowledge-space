import {
  Page,
  PageRequest,
  SelectInput,
  addPaginationParams,
  get,
} from "@api/utils";

const baseUrl = new URL("ks", import.meta.env.VITE_API_URL);
const baseUrlWithSlash = new URL("ks/", import.meta.env.VITE_API_URL);

export type KnowledgeSpace = SelectInput;

export type AssessmentTest = {
  id?: number;
  name: string;
  knowledgeSpace: string;
};

export function getKnowledgeSpaces(): Promise<KnowledgeSpace[]> {
  return get(baseUrl);
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