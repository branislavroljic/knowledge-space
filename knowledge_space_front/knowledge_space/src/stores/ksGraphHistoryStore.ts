import { KsGraphNode } from "@api/ksGraph/ksGraph";
import { create } from "zustand";

export type NodeCreateUpdateAction = {
  scope: "node";
  type: "create" | "update";
  data: KsGraphNode;
};

export type EdgeCreateAction = {
  scope: "edge";
  type: "create";
  data?: any;
};

export type CreateUpdateAction = EdgeCreateAction | NodeCreateUpdateAction;

export type DeleteNodeAction = {
  scope: "node";
  type: "delete";
  data: { id: number; knowledgeSpaceId: number };
};

export type DeleteKsGraphEdge = {
  id?: number;
  source: number;
  destination: number;
};

export type DeleteEdgeAction = {
  scope: "edge";
  type: "delete";
  data: DeleteKsGraphEdge;
};

export type DeleteAction = DeleteNodeAction | DeleteEdgeAction;

export type KsGraphAction = CreateUpdateAction | DeleteAction;

export interface KsGraphHistoryState {
  actions: KsGraphAction[];
  reverseActions: KsGraphAction[];
  nextUndoAction: KsGraphAction | undefined;
  nextRedoAction: KsGraphAction | undefined;
  index: number;
  addAction: (forward: KsGraphAction, backward: KsGraphAction) => void;
  undo: () => void;
  redo: (nodeId?: string) => void;
  resetEnd: () => void;
}

export const useKsGraphHistoryStore = create<KsGraphHistoryState>(
  (set, get) => ({
    actions: [],
    reverseActions: [],
    index: -1,
    nextUndoAction: undefined,
    nextRedoAction: undefined,
    addAction: (forward, backward) =>
      set((state) => ({
        ...state,
        actions: [...state.actions.slice(0, state.index + 1), forward],
        reverseActions: [
          ...state.reverseActions.slice(0, state.index + 1),
          backward,
        ],
        index: state.index + 1,
        nextUndoAction: backward,
        nextRedoAction: undefined,
      })),
    resetEnd: () =>
      set((state) => ({
        ...state,
        actions: [...state.actions.slice(0, state.index + 1)],
        reverseActions: [...state.actions.slice(0, state.index + 1)],
        nextUndoAction:
          state.index < 0 ? undefined : state.reverseActions[state.index],
        nextRedoAction: undefined,
      })),
    undo: () =>
      set((state) => ({
        ...state,
        index: state.index > 0 ? state.index - 1 : 0,
        nextRedoAction: state.actions[state.index],
        nextUndoAction:
          state.index > 0 ? state.reverseActions[state.index - 1] : undefined,
      })),

    redo: (nodeId) => {
      const undoAction = get().nextUndoAction;
      const redoAction = get().nextRedoAction;
      const newReverseActions = get().reverseActions;
      if (
        nodeId != undefined &&
        redoAction?.type == "create" &&
        redoAction.scope == "node"
      ) {
        newReverseActions[get().index] = {
          ...undoAction,
          data: {
            id: +nodeId,
          },
        } as DeleteNodeAction;
      }
      return set((state) => ({
        ...state,
        index:
          state.index < state.actions.length - 1
            ? state.index + 1
            : state.index,
        nextRedoAction:
          state.index < state.actions.length - 1
            ? state.actions[state.index + 1]
            : undefined,
        nextUndoAction: newReverseActions[state.index],
        reverseActions: [...newReverseActions],
      }));
    },
  })
);
