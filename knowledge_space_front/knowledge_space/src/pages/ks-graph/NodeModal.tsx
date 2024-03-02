import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import nodeSchema from "./nodeSchema";
import { Node } from "reactflow";
import { useParams } from "react-router-dom";
import {
  KsGraphNode,
  KsGraphNodeData,
  createNode,
  updateNode,
} from "@api/ksGraph/ksGraph";
import queryClient from "../../query-client";
import { useKsGraphNodeModalStore } from "@stores/ksGraphStore";
import { useKsGraphHistoryStore } from "@stores/ksGraphHistoryStore";
import useNotifiedMutation from "../../hooks/useNotifiedMutation";
import { ksGraphNodeToFlowNode } from "./util";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  TextField,
  Typography,
} from "@mui/material";

export interface KsGraphNodeModalProps {
  setNodes: Dispatch<
    SetStateAction<Node<KsGraphNodeData, string | undefined>[]>
  >;
}

export default function KsGraphNodeModal({ setNodes }: KsGraphNodeModalProps) {
  const { isOpen, item, closeModal, isCreate } = useKsGraphNodeModalStore();

  const [oldItem, setOldItem] = useState({} as KsGraphNode);

  const addAction = useKsGraphHistoryStore((state) => state.addAction);

  const routeParams = useParams();

  useEffect(() => {
    if (isOpen && item && !isCreate) {
      setOldItem(item);
    }
  }, [isOpen, item]);

  const createMutation = useNotifiedMutation({
    mutationFn: createNode,
    onSuccess: async (response: any) => {
      const ksNode = response.data as KsGraphNode;
      setNodes((nodes) => [...nodes, ksGraphNodeToFlowNode(ksNode)]);

      queryClient.invalidateQueries({
        queryKey: ["problems", routeParams.ksId],
      });
      addAction(
        {
          scope: "node",
          type: "create",
          data: {
            id: undefined,
            name: ksNode.name,
            positionX: ksNode.positionX,
            positionY: ksNode.positionY,
          } as KsGraphNode,
        },
        { scope: "node", type: "delete", data: { id: ksNode.id ?? 0 } }
      );
      reset();
    },
    showSuccessNotification: false,
  });

  const updateMutation = useNotifiedMutation({
    mutationFn: updateNode,
    onSuccess: async (response, input) => {
      const ksGraphNode = response.data as KsGraphNode;
      setNodes((nodes) =>
        nodes.map((node) => {
          if (Number(node.id) != ksGraphNode.id) {
            return node;
          }
          return ksGraphNodeToFlowNode(ksGraphNode);
        })
      );
      queryClient.invalidateQueries({
        queryKey: ["problems", routeParams.ksId],
      });
      addAction(
        {
          type: "update",
          scope: "node",
          data: input,
        },
        {
          type: "update",
          scope: "node",
          data: oldItem,
        }
      );
      closeModal();
    },
    showSuccessNotification: false,
  });

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isValid },
  } = useForm<KsGraphNode>({
    resolver: zodResolver(nodeSchema),
  });

  useEffect(() => {
    reset();
  }, [isOpen]);

  const saveKsGraphNode = (newItem: KsGraphNode) => {
    if (isValid) {
      if (isCreate) {
        createMutation.mutate(newItem);
      } else {
        updateMutation.mutate(newItem);
      }
    }
    closeModal();
  };

  return (
    <Dialog open={isOpen} onClose={closeModal}>
      <DialogTitle display={"flex"} gap={1}>
        <Typography variant="subtitle1">{"Create new problem"}</Typography>
      </DialogTitle>

      <Divider />
      <DialogContent>
        <Box component="form" sx={{ mt: 1 }}>
          <input
            type="hidden"
            {...register("id", {
              value: item?.id ?? undefined,
            })}
          />
          <input
            type="hidden"
            {...register("positionX", {
              required: true,
              value: item?.positionX ?? 0.0,
            })}
          />
          <input
            type="hidden"
            {...register("positionY", {
              required: true,
              value: item?.positionY ?? 0.0,
            })}
          />
          <Controller
            name="name"
            control={control}
            defaultValue={item?.name}
            render={({ field }) => (
              <TextField
                label={"Name"}
                required
                fullWidth
                error={errors.name !== undefined}
                helperText={errors.name?.message}
                placeholder={"Name"}
                margin="normal"
                id="amount"
                autoFocus
                {...field}
              />
            )}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeModal} variant="contained" color="error">
          {"Cancel"}
        </Button>
        <Button
          color="primary"
          variant="contained"
          onClick={handleSubmit(saveKsGraphNode)}
        >
          {"Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
