import { enUS } from "@mui/material/locale";
import { ThemeProvider, createTheme, useTheme } from "@mui/material";
import PageContainer from "@ui/container/PageContainer";
import { useMemo } from "react";
import AssessmentTestTable from "./AssessmentTestTable";
import Breadcrumb from "@layout/full/shared/breadcrumb/Breadcrumb";

export default function AssessmentTestPage() {
  const theme = useTheme();

  const BCrumb = useMemo(
    () => [
      {
        to: "/",
        title: "Assessment tests",
      },
    ],
    []
  );
  return (
    <PageContainer title="" description="this is innerpage">
      <Breadcrumb items={BCrumb} title={"Assessment tests"} />
      <ThemeProvider theme={createTheme(theme, enUS)}>
        <AssessmentTestTable />
      </ThemeProvider>
    </PageContainer>
  );
}
