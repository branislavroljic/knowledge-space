import { z } from "zod";

const standardMaxLength = import.meta.env.VITE_STANDARD_FIELD_MAX_LENGTH;

const activityNodeSchema = z.object({
  id: z.coerce.number().optional(),
  name: z
    .string({ required_error: "Name is required" })
    .min(3, {
      message: "Name must have at least 3 characters",
    })
    .max(standardMaxLength, {
      message: `Name must have at most ${standardMaxLength} characters`,
    }),
  positionX: z.coerce.number(),
  positionY: z.coerce.number(),
});

export default activityNodeSchema;
