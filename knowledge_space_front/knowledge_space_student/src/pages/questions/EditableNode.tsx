/* eslint-disable @typescript-eslint/no-unused-vars */
// import { Handle, NodeProps, Position } from "reactflow";
import { KsGraphNode } from "@api/ksGraph/ksGraph";
import { Box } from "@mui/material";
// import { Box, IconButton, Tooltip } from "@mui/material";
import { useKsGraphNodeModalStore } from "@stores/ksGraphStore";
// import { IconInfoCircle } from "@tabler/icons-react";
import { Handle, NodeProps, Position } from "reactflow";
import { lightBlue } from "@mui/material/colors";

export type EditableNodeProps = NodeProps<KsGraphNode>;

export default function EditableNode({
  id,
  selected,
  data,
  xPos,
  yPos,
}: EditableNodeProps) {
  const openModal = useKsGraphNodeModalStore((state) => state.openModal);
  return (
    <Box
      sx={{
        mx: "auto",
        maxWidth: "md",
        borderRadius: "lg",
        cursor: "pointer",
        backgroundColor: "lightblue",
        "&:hover": {
          border: selected ? "1px solid c" : "1px solid grey",
        },
      }}
      onDoubleClick={() => {
        openModal(
          {
            id: +id,
            positionX: xPos,
            positionY: yPos,
            name: data.name,
          },
          false
        );
      }}
    >
      <Box p={4} sx={{ backgroundColor: lightBlue }}>
        <Handle
          type="target"
          id={`${id}.top`}
          position={Position.Top}
          style={{ borderRadius: "0.5rem", backgroundColor: "#374151" }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "4px",
          }}
        >
          <div style={{ textAlign: "center" }}>{data.name}</div>
        </div>
        <Handle
          type="source"
          id={`${id}.bottom`}
          position={Position.Bottom}
          style={{ borderRadius: "0.5rem", backgroundColor: "#374151" }}
        />
      </Box>
    </Box>
  );
}
