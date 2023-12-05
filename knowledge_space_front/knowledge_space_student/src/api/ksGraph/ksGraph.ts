/* eslint-disable @typescript-eslint/no-explicit-any */
import { delById, post, put, get, del } from "@api/utils";
import { DeleteKsGraphEdge } from "@stores/ksGraphHistoryStore";
import { Connection, Edge } from "reactflow";

const baseUrl = new URL("ks/", import.meta.env.VITE_API_URL);

const nodeUrl = new URL("problems", baseUrl);
const nodeUrlWithSlash = new URL("problems/", baseUrl);
const edgeUrl = new URL("edges", baseUrl);

export type KsGraphNode = {
  id?: number;
  name: string;
  positionX: number;
  positionY: number;
};

export type KsGraphNodeData = {
  name: string;
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

export function getKsGraphData(ksId: number): Promise<KsGraphData> {
  return get(new URL(ksId.toString(), baseUrl));
}

export function createNode(input: KsGraphNode) {
  return post(new URL(1 + "/problems", baseUrl), JSON.stringify(input));
}

export function updateNode(input: KsGraphNode) {
  return put(nodeUrl, JSON.stringify(input));
}

export function deleteNode(id: number) {
  return delById(nodeUrlWithSlash, id);
}

export function createEdge(edge: Edge<any> | Connection) {
  const data = {
    sourceId: Number(edge.source),
    destinationId: Number(edge.target),
  } as KsGraphEdge;
  return post(edgeUrl, JSON.stringify(data));
}

export function deleteEdge(input: DeleteKsGraphEdge) {
  const edgeParams = {
    sourceId: input.source,
    destinationId: input.destination,
  };
  return del(edgeUrl, edgeParams);
}
