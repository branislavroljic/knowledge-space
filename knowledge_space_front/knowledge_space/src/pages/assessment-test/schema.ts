import { z } from "zod";

export const answerSchema = z.object({
  title: z.string(),
  correct: z.boolean(),
});

export const questionAnswersSchema = z.object({
  problemId: z.coerce.number(),
  title: z.string(),
  responses: z.array(answerSchema),
});

export const assessmentTestSchema = z.object({
  id: z.coerce.number(),
  name: z.string(),
  questions: z.array(questionAnswersSchema),
});
