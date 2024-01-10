/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Question,
  Response,
  UserAssessmentTest,
  getAssessmentTestQuestions,
  submitAssessmentTest,
} from "@api/assessmentTest/assessmentTest";
import { Button } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import PageContainer from "@ui/container/PageContainer";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import useNotifiedMutation from "../../hooks/useNotifiedMutation";
import Banner from "./Banner";
import queryClient, { invalidateAllQueries } from "../../query-client";

// function shuffle(array: Response[]) {
//   const shuffledArray = [...array];
//   for (let i = shuffledArray.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
//   }
//   return shuffledArray;
// }

export function QuestionsPage() {
  const params = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const assessmentTestId = useMemo(
    () => (params?.assessmentTestId ? +params?.assessmentTestId : 1),
    [params?.assessmentTestId]
  );

  const {
    data: questions,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["questions", assessmentTestId],
    queryFn: async () => getAssessmentTestQuestions(assessmentTestId),
  });

  const [answers, setAnswers] = useState<any>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState<any>(undefined);
  const [questionText, setQuestionText] = useState("");
  const [choices, setChoices] = useState<Response[] | undefined>(undefined);
  const [correctAnswer, setCorrectAnswer] = useState<number | undefined>(
    undefined
  );
  const [selectedAnswer, setSelectedAnswer] = useState<number | undefined>(
    undefined
  );
  const [showNextButton, setShowNextButton] = useState(false);

  const assessmentTestMutation = useNotifiedMutation({
    mutationFn: submitAssessmentTest,
    onSuccess: (response) => {
      resetState();
      setScore({ total: response.data.total, correct: response.data.correct });
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
      setCorrectAnswer(
        currentQuestion.responses.findIndex(
          (choice: Response) => choice.correct === true
        )
      );
    },
    [questions]
  );

  const resetState = () => {
    setChoices([]);
    setCorrectAnswer(undefined);
    setSelectedAnswer(undefined);
  };

  useEffect(() => {
    console.log(answers);
  }, [currentQuestionIndex]);

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
    } else {
      // if (params?.assessmentTestId) {
      //   console.log('tu sam')
      //   assessmentTestMutation.mutate({
      //     assessmentTestId: +params?.assessmentTestId,
      //     answers,
      //   } as UserAssessmentTest);
      // }
    }
  };
  const prevAnswersRef = useRef(answers);

  useEffect(() => {
    // Check if 'answers' has been updated and is different from the previous value
    if (
      answers.length > 0 &&
      questions &&
      currentQuestionIndex >= questions.length &&
      params?.assessmentTestId &&
      answers !== prevAnswersRef.current
    ) {
      console.log("tu sam");
      // Trigger the mutation with the updated 'answers' array
      assessmentTestMutation.mutate({
        assessmentTestId: +params?.assessmentTestId,
        answers,
      } as UserAssessmentTest);

      // Update the ref with the current 'answers' value
      prevAnswersRef.current = answers;
    }
  }, [answers, params?.assessmentTestId, assessmentTestMutation]);

  const selectChoice = (index: number) => {
    setSelectedAnswer(index);
    setShowNextButton(true);
  };

  useEffect(() => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowNextButton(false);
    showQuestion(0);
  }, [showQuestion]);

  if (isLoading) return "Loading...";
  if (isError) return "An error has occurred: ";

  return (
    <PageContainer title="Questions" description="this is innerpage">
      {!score ? (
        <div className="app">
          <h1>{state?.assessmentTest?.name}</h1>
          <div className="quiz">
            <h2 id="question">{questionText}</h2>
            <div
              id="answer-buttons"
              style={{ display: "flex", gap: "10px", flexDirection: "column" }}
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
        <Banner
          title={"Test results"}
          subtitle={`${score.correct} / ${score.total}`}
          goToText={"Go to home"}
          onGoToClick={() => navigate("/")}
        />
      )}
    </PageContainer>
  );
}
