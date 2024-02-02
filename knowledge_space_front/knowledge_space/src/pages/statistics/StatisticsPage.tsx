import { getStatistics } from "@api/ksGraph/knowledgeSpace";
import { Box } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import PageContainer from "@ui/container/PageContainer";
import BarChart from "@ui/dashboard/BarChart";
import Spinner from "@ui/view/spinner/Spinner";
import { useParams } from "react-router-dom";

export default function StatisticsPage() {
  const params = useParams();

  console.log(params);

  const { data: statisticsData, isLoading } = useQuery({
    queryKey: ["statistics", params.assessmentTestId],
    queryFn: () =>
      getStatistics(
        params.assessmentTestId ? +params.assessmentTestId : undefined
      ),
  });

  return (
    <PageContainer title="Statistics" description="this is statistics page">
      {isLoading ? (
        <Spinner></Spinner>
      ) : (
        <Box>
          <BarChart
            title={"Statistics"}
            // subtitle={t("statistic.monthlyTransactions")}
            // dataLabel1={"problem"}
            // dataItem1={'aa'}
            // dataLabel2={"Number of correct answers"}
            // dataItem2={t("statistic.currency", {
            //   value: data?.totalDiscountSavings?.toFixed(2).toString() ?? "0.00 ",
            //   currency: user?.currency,
            // })}
            data={statisticsData}
          />
        </Box>
      )}
    </PageContainer>
  );
}
