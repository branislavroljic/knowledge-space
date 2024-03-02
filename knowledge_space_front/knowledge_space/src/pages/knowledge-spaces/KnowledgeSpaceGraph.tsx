/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useMemo, useState } from "react";
import { KsGraphData, getKsGraphData } from "@api/ksGraph/ksGraph";
import { useParams } from "react-router-dom";
import ReactFlow, { Background, Controls, MiniMap } from "reactflow";
import "reactflow/dist/style.css";
import { Box, Button } from "@mui/material";
import PageContainer from "@ui/container/PageContainer";
import { useQuery } from "@tanstack/react-query";
import { useAssessmentTestModalStore } from "@stores/assessmentTestStore";
import AssessmentTestModal from "@pages/assessment-test/AssessmentTestModal";
import { ksGraphNodeToFlowNode, ksGraphToFlowEdge } from "@pages/ks-graph/util";
import EditableNode from "@pages/ks-graph/EditableNode";

export default function KnowledgeSpaceGraph() {
  const [assesmentTestShown, setAssesmentTestShown] = useState(false);

  const [ksGraphData, setKsGraphData] = useState<KsGraphData>();
  const [nodes, setNodes] = useState(
    ksGraphData?.nodes.map((x) => ksGraphNodeToFlowNode(x)) ?? []
  );
  const [edges, setEdges] = useState(
    ksGraphData?.edges.map((x) => ksGraphToFlowEdge(x)) ?? []
  );

  const params = useParams();

  //   const openAssessmentTestModal = useAssessmentTestModalStore(
  //     (state) => state.openModal
  //   );
  const { data } = useQuery({
    queryKey: ["ks", params.knowledgeSpaceId],
    queryFn: async () => {
      if (params.knowledgeSpaceId !== undefined) {
        return getKsGraphData(+params.knowledgeSpaceId);
      }
      return null;
    },
    enabled: params.knowledgeSpaceId !== undefined,
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

  return (
    <>
      <PageContainer title="KsGraph">
        <Button
          disabled={!params.knowledgeSpaceId}
          onClick={() => setAssesmentTestShown(!assesmentTestShown)}
          color={assesmentTestShown ? "error" : "success"}
        >
          {assesmentTestShown ? "Discard test" : "Create test"}
        </Button>
        <Box
          sx={{ display: "flex", flexDirection: "row", gap: 3, paddingTop: 2 }}
        >
          <Box
            sx={{
              minHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              flex: 1,
            }}
          >
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              style={{ flex: 1 }}
            >
              <Background />
              <Controls />
              <MiniMap nodeStrokeWidth={3} pannable zoomable />
            </ReactFlow>
          </Box>
          {assesmentTestShown && (
            <Box sx={{ flex: 1 }}>
              <AssessmentTestModal
                ksId={params.knowledgeSpaceId ? +params.knowledgeSpaceId : 1}
              />
            </Box>
          )}
        </Box>
      </PageContainer>
    </>
  );
}
