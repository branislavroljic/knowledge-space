import { NotificationData } from "@stores/notificationStore";
import { Dispatch, SetStateAction } from "react";
import { Edge, Node } from "reactflow";
import { ksGraphToFlowEdge, ksGraphNodeToFlowNode } from "./util";
import { DeleteKsGraphEdge, KsGraphAction } from "@stores/ksGraphHistoryStore";
import {
  KsGraphEdge,
  KsGraphNode,
  KsGraphNodeData,
  createEdge,
  createNode,
  deleteEdge,
  deleteNode,
  updateNode,
} from "@api/ksGraph/ksGraph";
import { AxiosResponse } from "axios";

function checkResponse(res: AxiosResponse<any, any>) {
  if (res.status != 200) {
    throw 500;
  }
  return res.data;
}

function nodeActionToPromise(
  action: KsGraphAction,
  setNodes: Dispatch<
    SetStateAction<Node<KsGraphNodeData, string | undefined>[]>
  >
) {
  switch (action.type) {
    case "create":
      return createNode(action.data as KsGraphNode)
        .then(checkResponse)
        .then((res) => res as KsGraphNode)
        .then((node) => {
          setNodes((nodes) => [...nodes, ksGraphNodeToFlowNode(node)]);
          return node.id;
        });
    case "update":
      return updateNode(action.data as KsGraphNode)
        .then(checkResponse)
        .then((res) => res as KsGraphNode)
        .then((node) =>
          setNodes((nodes) =>
            nodes.map((n) => {
              if (Number(n.id) != node.id) {
                return n;
              }
              return ksGraphNodeToFlowNode(node);
            })
          )
        );
    case "delete":
      return deleteNode((action.data as { id: number }).id).then(() =>
        setNodes((nodes) =>
          nodes.filter((n) => +n.id !== (action.data as { id: number }).id)
        )
      );
  }
}

function edgeActionToPromise(
  action: KsGraphAction,
  setEdges: Dispatch<SetStateAction<Edge<any>[]>>
) {
  switch (action.type) {
    case "create":
      return createEdge({
        source: action.data.source,
        target: action.data.destination,
      } as any)
        .then(checkResponse)
        .then((res) => res as KsGraphEdge)
        .then((edge) =>
          setEdges((edges) => [...edges, ksGraphToFlowEdge(edge)])
        );
    case "delete":
      return deleteEdge(action.data as DeleteKsGraphEdge).then(() =>
        setEdges((edges) =>
          edges.filter(
            (e) =>
              +e.source !== (action.data as DeleteKsGraphEdge).source ||
              +e.target !== (action.data as DeleteKsGraphEdge).destination
          )
        )
      );
  }
}

function ksGraphActionToPromise(
  action: KsGraphAction,
  setEdges: Dispatch<SetStateAction<Edge<any>[]>>,
  setNodes: Dispatch<SetStateAction<Node<any, string | undefined>[]>>
) {
  switch (action.scope) {
    case "node":
      return nodeActionToPromise(action, setNodes);
    case "edge":
      return edgeActionToPromise(action, setEdges);
  }
}

export async function undoRedoMutation(
  setEdges: Dispatch<SetStateAction<Edge<any>[]>>,
  setNodes: Dispatch<
    SetStateAction<Node<KsGraphNodeData, string | undefined>[]>
  >,
  successFn: (nodeId?: string) => void,
  openNotification: (data: NotificationData) => void,
  action?: KsGraphAction,
  setIsLoading?: (loading: boolean) => void
) {
  if (!action) {
    return;
  }

  const promise = ksGraphActionToPromise(action, setEdges, setNodes);

  try {
    if (setIsLoading) {
      setIsLoading(true);
    }
    const result = await promise;
    if (action.scope == "node" && action.type == "create") {
      successFn(result ? result + "" : "");
    } else {
      successFn();
    }
  } catch (error) {
    openNotification({
      isError: true,
      primaryText: "An error occurred while performing action",
      secondaryText: "Unable to persist changes on the server",
    });
  } finally {
    if (setIsLoading) {
      setIsLoading(false);
    }
  }
}
