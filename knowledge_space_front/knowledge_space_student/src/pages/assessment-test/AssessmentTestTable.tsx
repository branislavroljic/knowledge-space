import { useMemo } from "react";
import MaterialReactTable, { type MRT_ColumnDef } from "material-react-table";
import {
  Box,
  IconButton,
  Stack,
  ThemeProvider,
  Tooltip,
  createTheme,
  useTheme,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import RefreshIcon from "@mui/icons-material/Refresh";
import defaultColumns from "./columns";
import {
  AssessmentTest,
  getAssessmentTests,
} from "@api/assessmentTest/assessmentTest";
import QuizIcon from "@mui/icons-material/Quiz";
import { useNavigate } from "react-router-dom";

export default function AssessmentTestTable() {
  const theme = useTheme();

  const navigate = useNavigate();

  const { data, isError, isFetching, isLoading, refetch } = useQuery({
    queryKey: ["assessment_tests"],
    queryFn: async () => {
      return getAssessmentTests();
    },
  });

  const columns = useMemo<MRT_ColumnDef<AssessmentTest>[]>(
    () => defaultColumns(),
    []
  );

  const defaultData = useMemo(() => [] as AssessmentTest[], []);

  const questionsButton = (item: AssessmentTest, key: string) => (
    <Tooltip arrow title={"Take the test"} key={key}>
      <IconButton
        color="primary"
        onClick={(e) => {
          navigate("/assessment_tests/" + item.id + "/questions", {
            state: { assessmentTest: item },
          });
          e.stopPropagation();
        }}
      >
        <QuizIcon />
      </IconButton>
    </Tooltip>
  );

  return (
    <ThemeProvider theme={createTheme(theme)}>
      <MaterialReactTable
        columns={columns}
        data={data ?? defaultData}
        initialState={{ showColumnFilters: true }}
        manualFiltering
        manualPagination
        manualSorting
        enableGlobalFilter={false}
        muiToolbarAlertBannerProps={
          isError
            ? {
                color: "error",
                children: "Unable to fetch data",
              }
            : undefined
        }
        // onColumnFiltersChange={setColumnFilters}
        // onPaginationChange={setPagination}
        // onSortingChange={setSorting}
        renderTopToolbarCustomActions={() => (
          <Stack direction={"row"} gap={2}>
            <Tooltip arrow title="Refresh Data">
              <IconButton onClick={() => refetch()}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        )}
        rowCount={data?.length}
        state={{
          isLoading,
          showAlertBanner: isError,
          showProgressBars: isFetching,
        }}
        enableRowActions
        enableHiding={false}
        positionActionsColumn="last"
        displayColumnDefOptions={{
          "mrt-row-actions": {
            header: "", //change header text
          },
        }}
        renderRowActions={({ row }) => (
          <Box sx={{ display: "flex", flexWrap: "nowrap", gap: "8px" }}>
            {questionsButton(
              row.original as AssessmentTest,
              (row.original as AssessmentTest).id + "_" + "questions"
            )}
          </Box>
        )}
        muiTableBodyRowProps={({ row }) => ({
          onClick: () => {
            navigate("/assessment_tests/" + row.original.id + "/questions", {
              state: { assessmentTest: row.original },
            });
          },
          sx: {
            cursor: "pointer",
          },
        })}
      />
    </ThemeProvider>
  );
}
