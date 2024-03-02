import { KnowledgeSpace } from "@api/ksGraph/knowledgeSpace";
import { MRT_ColumnDef } from "material-react-table";

const defaultColumns = () =>
  [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "assessmentTest",
      header: "Assessment test",
    },
    {
      accessorKey: "isReal",
      header: "Real",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
      Cell: ({ row }) =>
        row.original.isReal ? (
          'Yes'
        ) : (
          "No"
        ),
    },
  ] as MRT_ColumnDef<KnowledgeSpace>[];

export default defaultColumns;
