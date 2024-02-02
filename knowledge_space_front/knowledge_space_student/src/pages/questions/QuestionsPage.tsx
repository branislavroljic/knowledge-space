/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Response,
  UserAssessmentTest,
  getAssessmentTestQuestions,
  submitAssessmentTest,
} from "@api/assessmentTest/assessmentTest";
import {
  Autocomplete,
  Box,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import PageContainer from "@ui/container/PageContainer";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import useNotifiedMutation from "../../hooks/useNotifiedMutation";
import queryClient, { invalidateAllQueries } from "../../query-client";
import { KsGraphData, getStudentRealKsGraphData } from "@api/ksGraph/ksGraph";
import ReactFlow, { Background, Controls, MiniMap } from "reactflow";
import { ksGraphNodeToFlowNode, ksGraphToFlowEdge } from "./util";
import EditableNode from "./EditableNode";
import "reactflow/dist/style.css";

export function QuestionsPage() {
  const params = useParams();
  const { state } = useLocation();

  const assessmentTestId = useMemo(
    () => (params?.assessmentTestId ? +params?.assessmentTestId : 1),
    [params?.assessmentTestId]
  );
  const [answers, setAnswers] = useState<any>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [studentKsGraphData, setStudentKsGraphData] = useState<
    KsGraphData | undefined
  >(undefined);
  const [questionText, setQuestionText] = useState("");
  const [choices, setChoices] = useState<Response[] | undefined>(undefined);
  const [selectedAnswer, setSelectedAnswer] = useState<number | undefined>(
    undefined
  );
  const [showNextButton, setShowNextButton] = useState(false);

  const {
    data: questions,
    isLoading: isLoadingQuestions,
    isError,
  } = useQuery({
    queryKey: ["questions", assessmentTestId],
    queryFn: async () => getAssessmentTestQuestions(assessmentTestId),
    enabled: !state?.assessmentTest?.completed,
  });

  const { data: realKsData, isLoading: isLoadingRealKsData } = useQuery({
    queryKey: ["real_ks", assessmentTestId],
    queryFn: async () => getStudentRealKsGraphData(assessmentTestId),
    enabled: state?.assessmentTest?.completed,
  });

  useEffect(() => {
    if (!realKsData) return;
    setStudentKsGraphData(realKsData);
  }, [realKsData]);

  const nodeTypes = useMemo(
    () => ({
      ksGraphNode: EditableNode,
    }),
    []
  );

  const assessmentTestMutation = useNotifiedMutation({
    mutationFn: submitAssessmentTest,
    onSuccess: (response) => {
      resetState();
      setStudentKsGraphData(response.data);
      invalidateAllQueries(queryClient, "assessment_tests");
    },
  });

  const showQuestion = useCallback(
    (index: number) => {
      resetState();
      if (!questions) return;
      const currentQuestion = questions[index];
      const questionNumber = index + 1;
      setQuestionText(`${questionNumber}. ${currentQuestion.title}`);
      setChoices(currentQuestion.responses);
    },
    [questions]
  );

  const resetState = () => {
    setChoices([]);
    setSelectedAnswer(undefined);
  };

  const handleNextButton = () => {
    setShowNextButton(false);
    if (questions && choices) {
      setAnswers((prevAnswers: any) => [
        ...prevAnswers,
        {
          questionId: questions[currentQuestionIndex].id,
          responseId: choices[selectedAnswer ?? 0].id,
        },
      ]);
    }
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);

    if (questions && currentQuestionIndex < questions.length - 1) {
      showQuestion(currentQuestionIndex + 1);
    }
  };
  const prevAnswersRef = useRef(answers);

  useEffect(() => {
    // Check if answers have been updated and is different from the previous value
    if (
      answers.length > 0 &&
      questions &&
      currentQuestionIndex >= questions.length &&
      params?.assessmentTestId &&
      answers !== prevAnswersRef.current
    ) {
      // Trigger the mutation with the updated 'answers' array
      assessmentTestMutation.mutate({
        assessmentTestId: +params?.assessmentTestId,
        answers,
      } as UserAssessmentTest);

      // Update the ref with the current answers' value
      prevAnswersRef.current = answers;
    }
  }, [
    answers,
    params?.assessmentTestId,
    assessmentTestMutation,
    questions,
    currentQuestionIndex,
  ]);

  const selectChoice = (index: number) => {
    setSelectedAnswer(index);
    setShowNextButton(true);
  };

  useEffect(() => {
    setCurrentQuestionIndex(0);
    setShowNextButton(false);
    showQuestion(0);
  }, [showQuestion]);

  if (isLoadingQuestions || isLoadingRealKsData) return "Loading...";
  if (isError) return "An error has occurred: ";

  return (
    <PageContainer title="Questions" description="this is innerpage">
      <Box sx={{ display: "flex" }}>
        {!studentKsGraphData ? (
          <div className="app">
            <h1>{state?.assessmentTest?.name}</h1>
            <div className="quiz">
              <h2 id="question">{questionText}</h2>
              <div
                id="answer-buttons"
                style={{
                  display: "flex",
                  gap: "10px",
                  flexDirection: "column",
                }}
              >
                {choices?.map((choice, index) => (
                  <Button
                    variant={
                      selectedAnswer != undefined && selectedAnswer == index
                        ? "contained"
                        : "outlined"
                    }
                    key={index}
                    onClick={() => selectChoice(index)}
                    style={{ width: "100%" }}
                  >
                    {choice.title}
                  </Button>
                ))}
              </div>
              {showNextButton && (
                <button id="next-button" onClick={handleNextButton}>
                  Next
                </button>
              )}
            </div>
          </div>
        ) : (
          <Box
            sx={{
              minHeight: "90vh",
              display: "flex",
              flex: 1,
              flexDirection: "column",
              justifyContent: "center",
              alignItems : 'center',
              gap : 2
            }}
          >
            <Typography variant="h4">Your Knowledge Space</Typography>
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
  );
}
