/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useEffect, useMemo, useState } from "react";
import { ksGraphNodeToFlowNode, ksGraphToFlowEdge } from "./util";
import EditableNode from "./EditableNode";
import {
  KsGraphData,
  KsGraphEdge,
  KsGraphNode,
  createEdge,
  deleteEdge,
  deleteNode,
  getKsGraphData,
  getRealKsGraphData,
  updateNode,
} from "@api/ksGraph/ksGraph";
import { useLoaderData, useParams } from "react-router-dom";
import { useKsGraphNodeModalStore } from "@stores/ksGraphStore";
import { useKsGraphHistoryStore } from "@stores/ksGraphHistoryStore";
import { useNotificationStore } from "@stores/notificationStore";
import useNotifiedMutation from "../../hooks/useNotifiedMutation";
import queryClient from "../../query-client";
import ReactFlow, {
  Background,
  Controls,
  // Controls,
  Edge,
  MiniMap,
  // MiniMap,
  NodeChange,
  applyNodeChanges,
} from "reactflow";
import "reactflow/dist/style.css";
import {
  Autocomplete,
  Box,
  Button,
  Divider,
  FormControlLabel,
  Switch,
  TextField,
} from "@mui/material";
import { undoRedoMutation } from "./undoMutations";
import KsGraphNodeModal from "./NodeModal";
import PageContainer from "@ui/container/PageContainer";
import {
  KnowledgeSpace,
  getAssessmentTestsForKS,
} from "@api/ksGraph/knowledgeSpace";
import { useQuery } from "@tanstack/react-query";
import { useAssessmentTestModalStore } from "@stores/assessmentTestStore";
import {
  AssessmentTest,
  createAssessmentTest,
} from "@api/assessmentTest/assessementTest";
import AssessmentTestModal from "@pages/assessment-test/AssessmentTestModal";

export default function KSGraphPage() {
  const [realKSShown, setRealKSShown] = useState(false);
  const knowledgeSpaces = useLoaderData() as KnowledgeSpace[];

  const [knowledgeSpaceId, setKnowledgeSpaceId] = useState<number | undefined>(
    undefined
  );
  const [assessementTestId, setAssessmentTestId] = useState<number | undefined>(
    undefined
  );
  const [ksGraphData, setKsGraphData] = useState<KsGraphData>();
  const [nodes, setNodes] = useState(
    ksGraphData?.nodes.map((x) => ksGraphNodeToFlowNode(x)) ?? []
  );
  const [edges, setEdges] = useState(
    ksGraphData?.edges.map((x) => ksGraphToFlowEdge(x)) ?? []
  );

  const openAssessmentTestModal = useAssessmentTestModalStore(
    (state) => state.openModal
  );
  const { data, refetch: refetchKnowledgeSpaceData } = useQuery({
    queryKey: ["knowledge_spaces", knowledgeSpaceId],
    queryFn: async () => {
      if (knowledgeSpaceId !== undefined) {
        return getKsGraphData(knowledgeSpaceId);
      }
      return null;
    },
    enabled: knowledgeSpaceId !== undefined,
  });

  const { data: assessmentTests, refetch: refetchAssessmentTests } = useQuery({
    queryKey: ["assessment_tests", knowledgeSpaceId],
    queryFn: async () => {
      if (knowledgeSpaceId !== undefined) {
        return getAssessmentTestsForKS(knowledgeSpaceId);
      }
      return null;
    },
    enabled: knowledgeSpaceId !== undefined,
  });

  const { data: realKsData, refetch: refetchRealKSData } = useQuery({
    queryKey: ["real_ks", assessementTestId],
    queryFn: async () => {
      if (assessementTestId !== undefined) {
        return getRealKsGraphData(assessementTestId);
      }
      return null;
    },
    enabled: assessementTestId !== undefined,
  });

  useEffect(() => {
    if (!data) return;
    setKsGraphData(data);
    setNodes(data?.nodes.map((x) => ksGraphNodeToFlowNode(x)));
    setEdges(data?.edges.map((x) => ksGraphToFlowEdge(x)));
  }, [data]);

  const nodeTypes = useMemo(
    () => ({
      ksGraphNode: EditableNode,
    }),
    []
  );

  const [oldNodeItem, setOldNodeItem] = useState({} as KsGraphNode);

  const routeParams = useParams();

  const openNodeModal = useKsGraphNodeModalStore((state) => state.openModal);

  const { addAction, undo, redo, nextRedoAction, nextUndoAction } =
    useKsGraphHistoryStore();

  const openNotification = useNotificationStore(
    (state) => state.openNotification
  );

  const onKnowledgeSpaceChange = (id: number) => {
    setKnowledgeSpaceId(id);
    refetchAssessmentTests();
  };

  const onAssessmentTestChange = (id: number) => {
    setAssessmentTestId(id);
    refetchRealKSData();
  };

  const edgeMutation = useNotifiedMutation({
    mutationFn: createEdge,
    onSuccess: (response, input) => {
      const ksGraphEdge = response.data as KsGraphEdge;
      // queryClient.invalidateQueries({
      //   queryKey: ["problems", routeParams.ksId],
      // });
      setEdges((edges: any) => [...edges, ksGraphToFlowEdge(ksGraphEdge)]);
      addAction(
        {
          scope: "edge",
          type: "create",
          data: input,
        },
        {
          type: "delete",
          scope: "edge",
          data: {
            id: ksGraphEdge.id,
            source: ksGraphEdge.sourceId,
            destination: ksGraphEdge.destinationId,
          },
        }
      );
    },
    showSuccessNotification: false,
  });

  const updateMutation = useNotifiedMutation({
    mutationFn: updateNode,
    onSuccess: (response, input) => {
      const ksGraphNode = response.data as KsGraphNode;
      const existingNode = nodes.some((node) => +node.id == ksGraphNode.id);
      if (!existingNode) {
        setNodes([...nodes, ksGraphNodeToFlowNode(ksGraphNode)]);
      } else {
        setNodes((nodes: any[]) =>
          nodes.map((node) => {
            if (node.id != ksGraphNode.id) {
              return node;
            }
            return ksGraphNodeToFlowNode(ksGraphNode);
          })
        );
      }
      // queryClient.invalidateQueries({
      //   queryKey: ["problems"],
      // });
      addAction(
        {
          type: "update",
          scope: "node",
          data: input,
        },
        {
          type: "update",
          scope: "node",
          data: oldNodeItem,
        }
      );
    },
    showSuccessNotification: false,
  });

  const deleteNodeMutation = useNotifiedMutation({
    mutationFn: deleteNode,
    onSuccess: (_, input) => {
      setNodes((nodes: any) => nodes.filter((x: any) => x.id != input));
      queryClient.invalidateQueries({
        queryKey: ["problems", routeParams.ksId],
      });
    },
    showSuccessNotification: false,
  });

  const deleteEdgeMutation = useNotifiedMutation({
    mutationFn: deleteEdge,
    onSuccess: (_, input) => {
      setEdges((edges: any) =>
        edges.filter(
          (e: any) => e.source != input.source || e.target != input.destination
        )
      );
      addAction(
        {
          scope: "edge",
          type: "delete",
          data: input,
        },
        {
          type: "create",
          scope: "edge",
          data: {
            id: input.id,
            source: input.source,
            destination: input.destination,
          },
        }
      );
      queryClient.invalidateQueries({
        queryKey: ["problems", routeParams.ksId],
      });
    },
    showSuccessNotification: true,
  });

  const onEdgesDelete = useCallback(
    (edges: Edge<any>[]) => {
      edges.forEach((e) =>
        deleteEdgeMutation.mutate({
          source: +e.source,
          destination: +e.target,
        })
      );
    },
    [deleteEdgeMutation]
  );

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      changes.forEach((c) => {
        if (c.type == "position") {
          const node = nodes.find((n: any) => n.id == c.id);
          if (node) {
            if (!c.dragging && oldNodeItem.positionX && oldNodeItem.positionY) {
              const newNode = {
                id: +node.id,
                name: node.data.name,
                knowledgeSpaceId: node.data.knowledgeSpaceId,
                positionX: node.position.x,
                positionY: node.position.y,
              } as KsGraphNode;

              if (
                newNode.positionX != oldNodeItem.positionX ||
                newNode.positionY != oldNodeItem.positionY
              ) {
                updateMutation.mutate(newNode, {
                  onSettled: () => {
                    setOldNodeItem({} as KsGraphNode);
                  },
                });
              }
            } else {
              if (!oldNodeItem.id) {
                const newOldNodeItem = {
                  id: +node.id,
                  name: node.data.name,
                  knowledgeSpaceId: node.data.knowledgeSpaceId,
                  positionX: node.position.x,
                  positionY: node.position.y,
                } as KsGraphNode;
                setOldNodeItem(newOldNodeItem);
              }
              setNodes((nodes: any) => applyNodeChanges([c], nodes));
            }
          }
        }
        if (c.type == "remove") {
          deleteNodeMutation.mutate(+c.id);
        }
        if (c.type == "select") {
          setNodes((nodes: any) =>
            nodes.map((n: any) => {
              if (n.id != c.id) {
                return n;
              }
              return {
                ...n,
                selected: c.selected,
              };
            })
          );
        }
      });
    },
    [
      nodes,
      oldNodeItem.positionX,
      oldNodeItem.positionY,
      oldNodeItem.id,
      updateMutation,
      deleteNodeMutation,
    ]
  );

  return (
    <>
      <PageContainer title="KsGraph">
        {/* <AssessmentTestModal /> */}
        <KsGraphNodeModal setNodes={setNodes} />
        <Box sx={{ display: "flex", gap: 3, paddingTop: 2 }}>
          <Box
            sx={{
              minHeight: "100vh",
              display: "flex",
              flexDirection: "column",
              flex: 1.1,
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: "10px",
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <Autocomplete
                onChange={(event, item) => {
                  onKnowledgeSpaceChange(item?.id);
                }}
                disablePortal
                disableClearable
                options={knowledgeSpaces.filter((ks) => !ks.isReal)}
                getOptionLabel={(option) => option.name}
                sx={{ width: 300 }}
                renderInput={(params) => (
                  <TextField {...params} label="Knowledge space" />
                )}
              />
              <FormControlLabel
                control={
                  <Switch
                    disabled={!knowledgeSpaceId}
                    checked={realKSShown}
                    onChange={() => setRealKSShown(!realKSShown)}
                  />
                }
                label="Show real KS graph"
              />
              <Box
                sx={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
                }}
              >
                {/* <Button
                  disabled={!knowledgeSpaceId}
                  onClick={() =>
                    openAssessmentTestModal(
                      {} as AssessmentTest,
                      createAssessmentTest,
                      true
                    )
                  }
                  color="success"
                >
                  Create test
                </Button> */}
                <Button
                  disabled={!nextUndoAction}
                  onClick={() =>
                    undoRedoMutation(
                      setEdges,
                      setNodes,
                      undo,
                      openNotification,
                      nextUndoAction
                    )
                  }
                  color="error"
                >
                  Undo
                </Button>

                <Button
                  disabled={!nextRedoAction}
                  hidden={true}
                  onClick={() =>
                    undoRedoMutation(
                      setEdges,
                      setNodes,
                      redo,
                      openNotification,
                      nextRedoAction
                    )
                  }
                  color="warning"
                >
                  Redo
                </Button>

                <Button
                  onClick={() =>
                    openNodeModal(
                      {
                        name: "",
                        positionY: 200,
                        positionX: 200,
                      } as KsGraphNode,
                      true
                    )
                  }
                >
                  +
                </Button>
              </Box>
            </Box>

            <ReactFlow
              nodes={nodes}
              edges={edges}
              onConnect={(connection) => edgeMutation.mutate(connection)}
              nodeTypes={nodeTypes}
              onNodesChange={onNodesChange}
              onEdgesDelete={onEdgesDelete}
              style={{ flex: 1 }}
            >
              <Background />
              <Controls />
              <MiniMap nodeStrokeWidth={3} pannable zoomable />
            </ReactFlow>
          </Box>

          {/********** real KS ****************/}

          {realKSShown && (
            <Box
              sx={{
                minHeight: "90vh",
                display: "flex",
                flexDirection: "column",
                flex: 1,
              }}
            >
              <Autocomplete
                onChange={(event, item) => {
                  onAssessmentTestChange(item?.id);
                }}
                disablePortal
                disableClearable
                options={assessmentTests ?? []}
                getOptionLabel={(option) => option.name}
                sx={{ width: 300 }}
                renderInput={(params) => (
                  <TextField {...params} label="Assessment tests" />
                )}
              />

              <ReactFlow
                nodes={realKsData?.nodes.map((x) => ksGraphNodeToFlowNode(x))}
                edges={realKsData?.edges.map((x) => ksGraphToFlowEdge(x))}
                nodeTypes={nodeTypes}
                style={{ flex: 1 }}
              >
                <Background />
                <Controls />
                <MiniMap nodeStrokeWidth={3} pannable zoomable />
              </ReactFlow>
            </Box>
          )}
        </Box>
      </PageContainer>
    </>
  );
}
