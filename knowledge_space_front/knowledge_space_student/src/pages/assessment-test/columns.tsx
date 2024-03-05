import { MRT_ColumnDef } from "material-react-table";
import { AssessmentTest } from "@api/assessmentTest/assessmentTest";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import NotInterestedIcon from "@mui/icons-material/NotInterested";

const defaultAssessmentTestsColumns = () =>
  [
    {
      accessorKey: "name",
      header: "Name",
      enableSorting: false,
      enableColumnFilter: false,
    },
    {
      accessorFn: (row) =>
        row.completed ? (
          <DoneAllIcon color="success" />
        ) : (
          <NotInterestedIcon color="error" />
        ),
      header: "Completed",
      enableColumnFilter: false,
      enableSorting: false,

      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
    },
    {
      accessorFn: (row) =>
        row.completed
          ? `${row.numOfCorrectAnswers}/${row.totalNumOfAnswers}`
          : "N/A",
      header: "Result",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
      enableColumnFilter: false,
      enableSorting: false,
    },
  ] as MRT_ColumnDef<AssessmentTest>[];

export default defaultAssessmentTestsColumns;
