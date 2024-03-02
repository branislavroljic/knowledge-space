import { useMemo, useState } from "react";
import {
  MaterialReactTable,
  type MRT_PaginationState,
  type MRT_ColumnDef,
  useMaterialReactTable,
} from "material-react-table";
import {
  Box,
  IconButton,
  ThemeProvider,
  Tooltip,
  createTheme,
  useTheme,
} from "@mui/material";
import { enUS } from "@mui/material/locale";
import { useQuery } from "@tanstack/react-query";
import RefreshIcon from "@mui/icons-material/Refresh";
import { PageRequest } from "@api/utils";
import {
  AssessmentTest,
  KnowledgeSpace,
  getPaginatedKnowledgeSpaces,
} from "@api/ksGraph/knowledgeSpace";
import { useNavigate } from "react-router-dom";
import defaultColumns from "./columns";
import AccountTreeRoundedIcon from "@mui/icons-material/AccountTreeRounded";

export default function KnowledgeSpaceTable() {
  const theme = useTheme();
  const navigate = useNavigate();

  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isError, isFetching, isLoading, refetch } = useQuery({
    queryKey: ["knowledge_spaces", pagination.pageIndex, pagination.pageSize],
    queryFn: async () => {
      const pageRequest = {
        page: pagination.pageIndex,
        size: pagination.pageSize,
      } as PageRequest;

      return getPaginatedKnowledgeSpaces(pageRequest);
    },
  });

  const columns = useMemo<MRT_ColumnDef<KnowledgeSpace>[]>(
    () => defaultColumns(),
    []
  );

  const defaultData = useMemo(() => [] as KnowledgeSpace[], []);

  const statisticsButton = (item: AssessmentTest, key: string) => (
    <Tooltip arrow title={"Graph"} key={key}>
      <IconButton
        color="success"
        onClick={(e) => {
          navigate(item.id + "/graph");
          e.stopPropagation();
        }}
      >
        <AccountTreeRoundedIcon />
      </IconButton>
    </Tooltip>
  );

  const table = useMaterialReactTable({
    columns,
    data: data?.rows ?? defaultData,
    enableSorting: false,
    manualPagination: true,
    enableColumnActions: false,
    enableGlobalFilter: false,
    enableRowActions: true,
    muiToolbarAlertBannerProps: isError
      ? {
          color: "error",
          children: "Unable to fetch data.",
        }
      : undefined,
    onPaginationChange: setPagination,
    renderTopToolbarCustomActions: () => (
      <Box sx={{ display: "flex", gap: "1rem", p: "4px" }}>
        <Tooltip arrow title="Refresh Data">
          <IconButton onClick={() => refetch()}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderRowActions: ({ row }) => (
      <Box sx={{ display: "flex", flexWrap: "nowrap", gap: "8px" }}>
        {statisticsButton(
          row.original as AssessmentTest,
          (row.original as AssessmentTest).id + "_" + "statistics"
        )}
      </Box>
    ),
    rowCount: data?.totalCount ?? 0,
    state: {
      isLoading,
      pagination,
      showAlertBanner: isError,
      showProgressBars: isFetching,
    },
    enableHiding: false,
    defaultColumn: {
      minSize: 10,
      maxSize: 1000,
      size: 120,
    },
  });

  return (
    <>
      <ThemeProvider theme={createTheme(theme, enUS)}>
        <MaterialReactTable table={table} />
      </ThemeProvider>
    </>
  );
}
