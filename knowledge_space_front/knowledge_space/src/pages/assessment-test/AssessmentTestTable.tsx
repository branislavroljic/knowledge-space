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
import defaultColumns from "./columns";
import { PageRequest } from "@api/utils";
import {
  AssessmentTest,
  getAssessmentTests,
} from "@api/ksGraph/knowledgeSpace";

export default function AssessmentTestTable() {
  const theme = useTheme();

  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isError, isFetching, isLoading, refetch } = useQuery({
    queryKey: ["assessment_tests", pagination.pageIndex, pagination.pageSize],
    queryFn: async () => {
      const pageRequest = {
        page: pagination.pageIndex,
        size: pagination.pageSize,
      } as PageRequest;

      return getAssessmentTests(pageRequest);
    },
  });

  const columns = useMemo<MRT_ColumnDef<AssessmentTest>[]>(
    () => defaultColumns(),
    []
  );

  const defaultData = useMemo(() => [] as AssessmentTest[], []);

  const table = useMaterialReactTable({
    columns,
    data: data?.rows ?? defaultData,
    enableSorting: false,
    manualPagination: true,
    enableColumnActions: false,
    enableGlobalFilter: false,
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
