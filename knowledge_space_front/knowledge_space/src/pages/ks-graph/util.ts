import {
  KsGraphEdge,
  KsGraphNode,
  KsGraphNodeData,
} from "@api/ksGraph/ksGraph";
import { Edge, MarkerType, Node } from "reactflow";

export function ksGraphNodeToFlowNode(node: KsGraphNode) {
  return {
    id: "" + node.id,
    data: {
      name: node.name,
      knowledgeSpaceId: node.knowledgeSpaceId,
    } as KsGraphNodeData,
    position: {
      x: node.positionX,
      y: node.positionY,
    },
    selected: node.selected,
    type: "ksGraphNode",
  } as Node<KsGraphNodeData>;
}

export function ksGraphToFlowEdge(edge: KsGraphEdge) {
  return {
    id: "" + edge.id,
    source: "" + edge.sourceId,
    target: "" + edge.destinationId,
    // type: "activityEdge",
    markerEnd: {
      type: MarkerType.Arrow,
    },
  } as Edge<any>;
}
