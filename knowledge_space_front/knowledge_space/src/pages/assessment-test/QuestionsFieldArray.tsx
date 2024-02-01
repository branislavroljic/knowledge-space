import {
  Autocomplete,
  Box,
  Button,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useFieldArray } from "react-hook-form";
import AnswersFieldArray from "./AnswersFieldArray";
import { Question } from "@api/assessmentTest/assessementTest";
import { useState } from "react";

export default function QuestionsFieldArray({
  control,
  errors,
  problems,
}: any) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const [selectedProblemIds, setSelectedProblemIds] = useState<number[]>([]);

  const handleAutocompleteChange = (event, item, index) => {
    const selectedId = item?.id;

    if (selectedId !== undefined) {
      // User selected a problem
      setSelectedProblemIds((prevSelectedIds) => [
        ...prevSelectedIds,
        selectedId,
      ]);
    } else {
      // User canceled the selection, so remove the problem ID
      setSelectedProblemIds((prevSelectedIds) => {
        const updatedIds = [...prevSelectedIds];
        const indexToRemove = updatedIds.indexOf(fields[index]?.problemId);
        if (indexToRemove !== -1) {
          updatedIds.splice(indexToRemove, 1);
        }
        return updatedIds;
      });
    }
  };
  const filteredProblems = problems.filter(
    (problem: any) => !selectedProblemIds.includes(problem.id)
  );

  return (
    <>
      <ul
        style={{
          listStyle: "none",
          listStylePosition: "inside",
          margin: 0,
          padding: 0,
        }}
      >
        {fields.map((item, index) => {
          return (
            <li key={item.id}>
              <Box style={{ border: "1px dashed grey" }} padding={2} mt={2}>
                <Typography variant="h6"> Question {index + 1}</Typography>
                <Controller
                  name={`questions.${index}.title` as const}
                  control={control}
                  defaultValue={""}
                  render={({ field }) => (
                    <TextField
                      label={"Question"}
                      fullWidth
                      error={errors?.questions && errors.questions[index].title}
                      helperText={
                        errors.questions
                          ? errors?.questions[index]?.title?.message
                          : ""
                      }
                      placeholder={"Question"}
                      margin="normal"
                      id={`title_${index}`}
                      {...field}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name={`questions.${index}.problemId` as const}
                  defaultValue={undefined}
                  render={({ field: { onChange, value } }) => (
                    <Autocomplete
                      onChange={(event, item) => {
                        onChange(item?.id);
                        handleAutocompleteChange(event, item, index);
                      }}
                      value={value}
                      options={filteredProblems}
                      getOptionLabel={(option) => option.name}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={"Problem"}
                          margin="normal"
                          variant="outlined"
                          error={
                            errors?.questions &&
                            errors.questions[index]?.problemId
                          }
                          helperText={
                            errors.questions
                              ? errors?.questions[index]?.problemId?.message ??
                                ""
                              : ""
                          }
                        />
                      )}
                    />
                  )}
                />
                <Box display={"flex"} justifyContent={"center"} mb={1}>
                  <Button onClick={() => remove(index)} color="error">
                    Delete question
                  </Button>
                </Box>
                <Divider>ANSWERS</Divider>
                <AnswersFieldArray
                  {...{
                    questionIndex: index,
                    control: control,
                    errors: errors,
                  }}
                />
              </Box>
            </li>
          );
        })}
      </ul>

      <Box display={"flex"} justifyContent={"center"} mt={2}>
        <Button
          onClick={() => {
            append({} as Question);
          }}
        >
          Add question
        </Button>
      </Box>
    </>
  );
}
