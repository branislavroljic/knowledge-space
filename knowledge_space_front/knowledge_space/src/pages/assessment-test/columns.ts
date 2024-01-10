import { MRT_ColumnDef } from "material-react-table";
import { AssessmentTest } from "@api/ksGraph/knowledgeSpace";

const defaultColumns = () =>
  [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "knowledgeSpace",
      header: "Knowledge space",
    },
  ] as MRT_ColumnDef<AssessmentTest>[];

export default defaultColumns;
