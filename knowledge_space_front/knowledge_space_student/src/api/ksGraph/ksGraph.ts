/* eslint-disable @typescript-eslint/no-explicit-any */
import { get } from "@api/utils";

const baseUrl = new URL("assessment_tests/", import.meta.env.VITE_API_URL);

export type KsGraphNode = {
  id?: number;
  name: string;
  knowledgeSpaceId?: number;
  positionX: number;
  positionY: number;
};

export type KsGraphNodeData = {
  name: string;
  knowledgeSpaceId?: number;
};

export type KsGraphEdge = {
  id?: number;
  sourceId: number;
  destinationId: number;
};

export type KsGraphData = {
  nodes: KsGraphNode[];
  edges: KsGraphEdge[];
};

export function getStudentRealKsGraphData(assessmentTestId: number): Promise<KsGraphData> {
  return get(new URL(assessmentTestId.toString() + '/real_ks', baseUrl));
}
