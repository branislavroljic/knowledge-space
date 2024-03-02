import { enUS } from "@mui/material/locale";
import { ThemeProvider, createTheme, useTheme } from "@mui/material";
import PageContainer from "@ui/container/PageContainer";
import { useMemo } from "react";
import Breadcrumb from "@layout/full/shared/breadcrumb/Breadcrumb";
import KnowledgeSpaceTable from "./KnowledgeSpaceTable";

export default function KnowledgeSpacePage() {
  const theme = useTheme();

  const BCrumb = useMemo(
    () => [
      {
        to: "/",
        title: "Knowledge spaces",
      },
    ],
    []
  );
  return (
    <PageContainer title="" description="this is innerpage">
      <Breadcrumb items={BCrumb} title={"Knowledge spaces"} />
      <ThemeProvider theme={createTheme(theme, enUS)}>
        <KnowledgeSpaceTable />
      </ThemeProvider>
    </PageContainer>
  );
}
