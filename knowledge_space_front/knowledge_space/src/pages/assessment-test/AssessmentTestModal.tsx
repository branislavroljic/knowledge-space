import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  AssessmentTest,
  createAssessmentTest,
  getKSProblems,
} from "@api/assessmentTest/assessementTest";
import useNotifiedMutation from "../../hooks/useNotifiedMutation";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  TextField,
} from "@mui/material";
import { useAssessmentTestModalStore } from "@stores/assessmentTestStore";
import queryClient, { invalidateAllQueries } from "../../query-client";
import QuestionsFieldArray from "./QuestionsFieldArray";
import { useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { assessmentTestSchema } from "./schema";

const ksId = 1;

export default function AssessmentTestModal() {
  const { isOpen, closeModal } = useAssessmentTestModalStore();
  const [hasChanged, setHasChanged] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isValid },
    getValues,
  } = useForm<AssessmentTest>({
    resolver: zodResolver(assessmentTestSchema),
  });

  const { data: problems } = useQuery({
    queryKey: ["problems", ksId],
    queryFn: async () => {
      if (ksId !== undefined) {
        return getKSProblems(1);
      }
      return null;
    },
  });

  useEffect(() => reset(), [isOpen, reset]);

  const handleCloseModal = (hasChanged: boolean) => {
    if (hasChanged) {
      invalidateAllQueries(queryClient, "assessmentTests");
    }
    closeModal();
  };

  const assessmentTestMutation = useNotifiedMutation({
    mutationFn: createAssessmentTest,
    onSuccess: () => {
      setHasChanged(true);
      handleCloseModal(true);

      reset();
    },
    showSuccessNotification: true,
  });

  const saveAssessmentTest = (newItem: AssessmentTest) => {
    if (isValid) {
      assessmentTestMutation.mutate(newItem);
    }
  };

  const onError = (errors: any, e: any) => console.log(errors, e);

  return (
    <Dialog
      open={isOpen}
      onClose={() => handleCloseModal(hasChanged)}
      fullWidth={true}
      maxWidth={"sm"}
    >
      <DialogTitle>Test</DialogTitle>
      <Box
        component="form"
        onSubmit={handleSubmit(createAssessmentTest, onError)}
        sx={{ mt: 3 }}
      >
        <DialogContent>
          <input
            type="hidden"
            {...register("id", {
              required: true,
              value: 1,
            })}
          />

          <Controller
            name={"name"}
            control={control}
            defaultValue={""}
            render={({ field }) => (
              <TextField
                label={"Name"}
                fullWidth
                error={errors.name !== undefined}
                helperText={errors.name?.message}
                placeholder={"Name"}
                margin="normal"
                id={"name"}
                {...field}
              />
            )}
          />
          <Divider>QUESTIONS</Divider>
          <QuestionsFieldArray
            {...{ control: control, errors: errors, problems }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              handleCloseModal(hasChanged);
            }}
            color="error"
            variant="contained"
          >
            {"Cancel"}
          </Button>
          <Button
            type="submit"
            onClick={() => {
              console.log(isValid);
              console.log(JSON.stringify(errors));
              console.log(getValues());
              handleSubmit(saveAssessmentTest, onError);
            }}
            color="primary"
            variant="contained"
          >
            {"Save"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
