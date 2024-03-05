import { StudentAssessmentTest } from "@api/assessmentTest/assessementTest";
import { MRT_ColumnDef } from "material-react-table";

const defaultColumns = () =>
  [
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "numOfCorrectAnswers",
      header: "Number of correct answers",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
    },
    {
      accessorKey: "totalNumOfAnswers",
      header: "Total number of answers",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
    },
  ] as MRT_ColumnDef<StudentAssessmentTest>[];

export default defaultColumns;
