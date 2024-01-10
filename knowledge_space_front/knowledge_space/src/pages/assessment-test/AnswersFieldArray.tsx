import { Response } from "@api/assessmentTest/assessementTest";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
} from "@mui/material";
import { Controller, useFieldArray } from "react-hook-form";

export default function AnswersFieldArray({
  questionIndex,
  control,
  errors,
}: any) {
  const { fields, remove, append } = useFieldArray({
    control,
    name: `questions.${questionIndex}.responses`,
  });

  return (
    <div>
      {fields.map((item, k) => {
        return (
          <Box key={item.id} style={{ marginLeft: 20 }}>
            <label>Answer:</label>
            <Controller
              name={`questions.${questionIndex}.responses.${k}.title` as const}
              control={control}
              defaultValue={""}
              render={({ field }) => (
                <TextField
                  label={"Title"}
                  fullWidth
                  error={
                    errors.questions &&
                    errors.questions[questionIndex].responses &&
                    errors.questions[questionIndex].responses[k]?.title
                  }
                  helperText={
                    errors.questions &&
                    errors.questions[questionIndex]?.responses[k]?.title
                      ? errors.questions[questionIndex].responses[k]?.title
                          .message
                      : undefined
                  }
                  placeholder={"Title"}
                  margin="normal"
                  id={`response_title_${k}`}
                  {...field}
                />
              )}
            />

            <FormControlLabel
              control={
                <Controller
                  name={
                    `questions.${questionIndex}.responses.${k}.correct` as const
                  }
                  control={control}
                  defaultValue={false}
                  render={({ field: props }) => (
                    <Checkbox
                      {...props}
                      checked={!!props.value}
                      onChange={(e) => props.onChange(e.target.checked)}
                    />
                  )}
                />
              }
              label={"Correct"}
            />

            <Button color="error" onClick={() => remove(k)}>
              Remove answer
            </Button>
          </Box>
        );
      })}

      <Button type="button" onClick={() => append({} as Response)}>
        Add answer
      </Button>

      <hr />
    </div>
  );
}
