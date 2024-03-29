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
  generateRealKnowledgeSpace,
  getAssessmentTests,
} from "@api/ksGraph/knowledgeSpace";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import BarChartIcon from "@mui/icons-material/BarChart";
import { getUserFromStorage } from "@api/auth";
import { useNavigate } from "react-router-dom";
import QuizIcon from "@mui/icons-material/Quiz";
import useNotifiedMutation from "../../hooks/useNotifiedMutation";
import AccountTreeRoundedIcon from "@mui/icons-material/AccountTreeRounded";
import PeopleIcon from "@mui/icons-material/People";

export default function AssessmentTestTable() {
  const theme = useTheme();
  const user = getUserFromStorage();
  const navigate = useNavigate();

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

  const realKSMutation = useNotifiedMutation({
    mutationFn: generateRealKnowledgeSpace,
    showSuccessNotification: true,
  });

  const columns = useMemo<MRT_ColumnDef<AssessmentTest>[]>(
    () => defaultColumns(),
    []
  );

  const defaultData = useMemo(() => [] as AssessmentTest[], []);

  const handleDownload = async (id: number) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}assessment_tests/${id}/imsqti`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(new Blob([blob]));
        const a = document.createElement("a");
        a.href = url;
        a.download = "qti.zip";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        console.error("Failed to fetch the file");
      }
    } catch (error) {
      console.error("Error fetching the file:", error);
    }
  };

  const qtiButton = (item: AssessmentTest, key: string) => (
    <Tooltip arrow title={"Generate IMS QTI"} key={key}>
      <IconButton
        color="warning"
        onClick={(e) => {
          handleDownload(item.id);
          // generateQTI(item.id);
          e.stopPropagation();
        }}
      >
        <FileDownloadIcon />
      </IconButton>
    </Tooltip>
  );

  const questionsButton = (item: AssessmentTest, key: string) => (
    <Tooltip arrow title={"View test"} key={key}>
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

  const statisticsButton = (item: AssessmentTest, key: string) => (
    <Tooltip arrow title={"Statistics"} key={key}>
      <IconButton
        color="success"
        onClick={(e) => {
          navigate("/assessment_tests/" + item.id + "/statistics");
          e.stopPropagation();
        }}
      >
        <BarChartIcon />
      </IconButton>
    </Tooltip>
  );

  const studentsButton = (item: AssessmentTest, key: string) => (
    <Tooltip arrow title={"Students who completed test"} key={key}>
      <IconButton
        color="primary"
        onClick={(e) => {
          navigate("/assessment_tests/" + item.id + "/students", {
            state: { assessmentTest: item },
          });
          e.stopPropagation();
        }}
      >
        <PeopleIcon />
      </IconButton>
    </Tooltip>
  );

  const generateRealKsButton = (item: AssessmentTest, key: string) => (
    <Tooltip arrow title={"Generate Real KS"} key={key}>
      <IconButton
        color="secondary"
        onClick={(e) => {
          realKSMutation.mutate(item.id);
          // generateQTI(item.id);
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
        {qtiButton(
          row.original as AssessmentTest,
          (row.original as AssessmentTest).id + "_" + "qti"
        )}
        {questionsButton(
          row.original as AssessmentTest,
          (row.original as AssessmentTest).id + "_" + "questions"
        )}
        {statisticsButton(
          row.original as AssessmentTest,
          (row.original as AssessmentTest).id + "_" + "statistics"
        )}
        {generateRealKsButton(
          row.original as AssessmentTest,
          (row.original as AssessmentTest).id + "_" + "realKS"
        )}
        {studentsButton(
          row.original as AssessmentTest,
          (row.original as AssessmentTest).id + "_" + "students"
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
