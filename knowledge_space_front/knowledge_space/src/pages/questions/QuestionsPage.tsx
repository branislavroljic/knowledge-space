/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  Response,
  getAssessmentTestQuestions,
} from "@api/assessmentTest/assessementTest";
import { Box, Button, Stack } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import PageContainer from "@ui/container/PageContainer";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useLocation } from "react-router-dom";

export function QuestionsPage() {
  const params = useParams();
  const { state } = useLocation();

  const assessmentTestId = useMemo(
    () => (params?.assessmentTestId ? +params?.assessmentTestId : 1),
    [params?.assessmentTestId]
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [questionText, setQuestionText] = useState("");
  const [choices, setChoices] = useState<Response[] | undefined>(undefined);

  const {
    data: questions,
    isLoading: isLoadingQuestions,
    isError,
  } = useQuery({
    queryKey: ["questions", assessmentTestId],
    queryFn: async () => getAssessmentTestQuestions(assessmentTestId),
    enabled: !state?.assessmentTest?.completed,
  });

  const showQuestion = useCallback(
    (index: number) => {
      if (!questions) return;
      const currentQuestion = questions[index];
      const questionNumber = index + 1;
      setQuestionText(`${questionNumber}. ${currentQuestion.title}`);
      setChoices(currentQuestion.responses);
    },
    [questions]
  );

  const handleNextButton = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);

    if (questions && currentQuestionIndex < questions.length - 1) {
      showQuestion(currentQuestionIndex + 1);
    }
  };

  const handlePrevButton = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex - 1);

    if (questions && currentQuestionIndex < questions.length - 1) {
      showQuestion(currentQuestionIndex - 1);
    }
  };

  useEffect(() => {
    setCurrentQuestionIndex(0);
    showQuestion(0);
  }, [showQuestion]);

  if (isLoadingQuestions) return "Loading...";
  if (isError) return "An error has occurred: ";

  return (
    <PageContainer title="Questions" description="this is innerpage">
      <Box sx={{ display: "flex", paddingTop: 2 }}>
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
                  variant={"outlined"}
                  key={index}
                  disabled={true}
                  style={{ width: "100%" }}
                >
                  {choice.title}
                </Button>
              ))}
            </div>

            <Stack
              direction={"row"}
              gap={2}
              display={"flex"}
              justifyContent={"space-between"}
              mt={3}
            >
              {currentQuestionIndex > 0 && (
                <Button fullWidth color="error" onClick={handlePrevButton}>
                  Prev
                </Button>
              )}
              {questions?.length &&
                currentQuestionIndex < questions?.length && (
                  <Button fullWidth onClick={handleNextButton}>
                    Next
                  </Button>
                )}
            </Stack>
          </div>
        </div>
      </Box>
    </PageContainer>
  );
}
