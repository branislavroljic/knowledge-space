import PageContainer from "@ui/container/PageContainer";
import AssessmentTestTable from "./AssessmentTestTable";
import { useMemo } from "react";
import Breadcrumb from "@layout/full/Breadcrumb";

export default function AssessmentTestPage() {
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
    <PageContainer description="Assessment tests page">
      <Breadcrumb title={"Assessment tests"} items={BCrumb} />
      <AssessmentTestTable></AssessmentTestTable>
    </PageContainer>
  );
}
