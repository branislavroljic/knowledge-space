import { Autocomplete, Button, TextField } from "@mui/material";
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

  const handleAutocompleteChange = (event, item) => {
    const selectedId = item?.id;
    setSelectedProblemIds((prevSelectedIds) => [
      ...prevSelectedIds,
      selectedId,
    ]);
  };

  const filteredProblems = problems.filter(
    (problem: any) => !selectedProblemIds.includes(problem.id)
  );

  return (
    <>
      <ul style={{ listStyle: "none" }}>
        {fields.map((item, index) => {
          return (
            <li key={item.id}>
              <Controller
                name={`questions.${index}.title` as const}
                control={control}
                defaultValue={""}
                render={({ field }) => (
                  <TextField
                    label={"Title"}
                    fullWidth
                    error={errors?.questions && errors.questions[index].title}
                    helperText={
                      errors.questions
                        ? errors?.questions[index]?.title?.message
                        : ""
                    }
                    placeholder={"Title"}
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
                      handleAutocompleteChange(event, item);
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
                            ? errors?.questions[index]?.problemId?.message ?? ""
                            : ""
                        }
                      />
                    )}
                  />
                )}
              />

              <Button onClick={() => remove(index)}>Delete</Button>
              <AnswersFieldArray
                {...{
                  questionIndex: index,
                  control: control,
                  errors: errors,
                }}
              />
            </li>
          );
        })}
      </ul>

      <section>
        <Button
          onClick={() => {
            append({} as Question);
          }}
        >
          Add question
        </Button>
      </section>
    </>
  );
}
