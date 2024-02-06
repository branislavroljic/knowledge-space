import { Response } from "@api/assessmentTest/assessementTest";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useFieldArray } from "react-hook-form";

import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";

export default function AnswersFieldArray({
  questionIndex,
  control,
  errors,
}: any) {
  const { fields, remove, append } = useFieldArray({
    control,
    name: `questions.${questionIndex}.responses`,
  });

  const [correctAnswerIndex, setCorrectAnswerIndex] = useState<number | null>(
    null
  );

  return (
    <div>
      {fields.map((item, k) => {
        return (
          <Box key={item.id} style={{ marginLeft: 20, marginTop: 10 }}>
            <Typography variant="subtitle2" fontWeight={"700"}>
              {" "}
              Answer {k + 1}
            </Typography>
            <Stack
              direction={"row"}
              justifyContent={"center"}
              alignItems={"center"}
              gap={2}
            >
              <Controller
                name={
                  `questions.${questionIndex}.responses.${k}.title` as const
                }
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
              <IconButton color="error" onClick={() => remove(k)}>
                <DeleteIcon />
              </IconButton>
            </Stack>

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
                      checked={!!props.value && correctAnswerIndex == k}
                      onChange={(e) => {
                        props.onChange(e.target.checked);
                        setCorrectAnswerIndex(k);
                      }}
                    />
                  )}
                />
              }
              label={"Correct"}
            />
          </Box>
        );
      })}

      <Box display={"flex"} justifyContent={"center"} mt={2}>
        <Button
          type="button"
          color="warning"
          onClick={() => append({} as Response)}
        >
          Add answer
        </Button>
      </Box>
      {/* <hr /> */}
    </div>
  );
}
