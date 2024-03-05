import { enUS } from "@mui/material/locale";
import { ThemeProvider, createTheme, useTheme } from "@mui/material";
import PageContainer from "@ui/container/PageContainer";
import { useMemo } from "react";
import Breadcrumb from "@layout/full/shared/breadcrumb/Breadcrumb";
import StudentsTable from "./StudentsTable";

export default function StudentsPage() {
  const theme = useTheme();

  const BCrumb = useMemo(
    () => [
      {
        to: "/",
        title: "Test-takers",
      },
    ],
    []
  );
  return (
    <PageContainer title="" description="this is innerpage">
      <Breadcrumb items={BCrumb} title={"Test-takers"} />
      <ThemeProvider theme={createTheme(theme, enUS)}>
        <StudentsTable />
      </ThemeProvider>
    </PageContainer>
  );
}
