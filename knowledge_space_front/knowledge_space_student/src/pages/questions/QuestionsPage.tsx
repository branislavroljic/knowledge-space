/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Question,
  Response,
  getAssessmentTestQuestions,
} from "@api/assessmentTest/assessmentTest";
import { Button } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import PageContainer from "@ui/container/PageContainer";
import { useEffect, useMemo, useState } from "react";
import { useParams, useLocation } from "react-router-dom";

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

  const assessmentTestId = useMemo(
    () => (params?.assessmentTestId ? +params?.assessmentTestId : 1),
    [params?.assessmentTestId]
  );

  const { data: questions } = useQuery({
    queryKey: ["questions", assessmentTestId],
    queryFn: async () => getAssessmentTestQuestions(assessmentTestId),
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [questionText, setQuestionText] = useState("");
  const [choices, setChoices] = useState<Response[] | undefined>(undefined);
  const [correctAnswer, setCorrectAnswer] = useState<number | undefined>(
    undefined
  );
  const [selectedAnswer, setSelectedAnswer] = useState<number | undefined>(
    undefined
  );
  const [showNextButton, setShowNextButton] = useState(false);

  const showQuestion = (index: number) => {
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
  };

  const resetState = () => {
    setChoices([]);
    setCorrectAnswer(undefined);
    setSelectedAnswer(undefined);
  };

  const handleNextButton = () => {
    setShowNextButton(false);
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);

    if (questions && currentQuestionIndex < questions.length - 1) {
      showQuestion(currentQuestionIndex + 1);
    } else {
      showScore();
    }
  };

  const selectChoice = (isCorrect: boolean, index: number) => {
    if (isCorrect) {
      setScore(score + 1);
    }

    setSelectedAnswer(index);
    setShowNextButton(true);
  };

  const showScore = () => {
    resetState();
    setQuestionText(`You scored ${score} out of ${questions?.length}!`);
  };

  useEffect(() => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowNextButton(false);
    showQuestion(0);
  }, [showQuestion]);

  return (
    <PageContainer title="Questions" description="this is innerpage">
      <div className="app">
        <h1>{state?.name}</h1>
        <div className="quiz">
          <h2 id="question">{questionText}</h2>
          <div
            id="answer-buttons"
            style={{ display: "flex", gap: "10px", flexDirection: "column" }}
          >
            {choices?.map((choice, index) => (
              <Button
                variant={
                  selectedAnswer && selectedAnswer == index
                    ? "contained"
                    : "outlined"
                }
                key={index}
                onClick={() => selectChoice(choice.correct, index)}
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
    </PageContainer>
  );
}
