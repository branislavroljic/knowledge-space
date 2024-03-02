import { useEffect } from "react";
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
  Card,
  CardActions,
  CardContent,
  // Dialog,
  // DialogActions,
  // DialogContent,
  // DialogTitle,
  Divider,
  TextField,
} from "@mui/material";
import { useAssessmentTestModalStore } from "@stores/assessmentTestStore";
import queryClient, { invalidateAllQueries } from "../../query-client";
import QuestionsFieldArray from "./QuestionsFieldArray";
import { useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { assessmentTestSchema } from "./schema";
import Spinner from "@ui/view/spinner/Spinner";
interface AssessmentTestModalProps {
  ksId: number; // Adjust the type according to your requirements
}

const AssessmentTestModal: React.FC<AssessmentTestModalProps> = ({ ksId }) => {
  const { isOpen, closeModal } = useAssessmentTestModalStore();
  // const [hasChanged, setHasChanged] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isValid },
  } = useForm<AssessmentTest>({
    resolver: zodResolver(assessmentTestSchema),
  });

  const { data: problems, isLoading } = useQuery({
    queryKey: ["problems", ksId],
    queryFn: async () => {
      if (ksId !== undefined) {
        return getKSProblems(ksId);
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
      // setHasChanged(true);
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

  if (isLoading) return <Spinner />;

  return (
    // <Dialog
    //   open={isOpen}
    //   onClose={() => handleCloseModal(hasChanged)}
    //   fullWidth={true}
    //   maxWidth={"sm"}
    // >
    //   <DialogTitle>Test</DialogTitle>
    <Card sx={{ maxHeight: "90vh", overflow: "auto" }}>
      <Box
        component="form"
        onSubmit={handleSubmit(createAssessmentTest, onError)}
        sx={{ mt: 3 }}
      >
        {/* <DialogContent> */}
        <CardContent>
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
        </CardContent>
        {/* </DialogContent> */}
        {/* <DialogActions> */}
        <CardActions sx={{ display: "flex", justifyContent: "center" }}>
          {/* <Button
            onClick={() => {
              handleCloseModal(hasChanged);
            }}
            color="error"
            variant="contained"
          >
            {"Cancel"}
          </Button> */}
          <Button
            type="submit"
            onClick={() => {
              handleSubmit(saveAssessmentTest, onError);
            }}
            color="primary"
            variant="contained"
          >
            {"Save"}
          </Button>
        </CardActions>
        {/* </DialogActions> */}
      </Box>
    </Card>
    // </Dialog>
  );
};

export default AssessmentTestModal;
