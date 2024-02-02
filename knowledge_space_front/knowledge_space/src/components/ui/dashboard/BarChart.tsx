import React from "react";
import Chart from "react-apexcharts";
import { useTheme } from "@mui/material/styles";

// import DashboardWidgetCard from '../../shared/DashboardWidgetCard';
import { Props } from "react-apexcharts";
import { BarChartProps } from "@pages/Statistic/StatisticPage";

const BarChart = ({ data }: BarChartProps) => {
  // chart color
  const theme = useTheme();

  const [xvalues, yvalues] = React.useMemo(() => {
    const xvalues = data?.map((report: any) => [report.xvalue]);
    const yvalues = data?.map((report: any) => report.yvalue.toFixed(2));
    return [xvalues, yvalues];
  }, [data]);

  // chart
  const optionscolumnchart: Props = {
    chart: {
      type: "bar",
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: "#adb0bb",
      toolbar: {
        show: true,
        offsetX: 0,
        offsetY: 0,
        tools: {
          download: true,
          // selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          // pan: true,
          // reset: true | '<img src="/static/icons/reset.png" width="20">',
          // customIcons: [],
        },
        export: {
          csv: {
            filename: undefined,
            columnDelimiter: ",",
            headerCategory: "Date",
            headerValue: "value",
            // dateFormatter() {
            //   return new Date().toDateString();
            // },
          },
          svg: {
            filename: undefined,
          },
          png: {
            filename: undefined,
          },
        },
        autoSelected: "zoom",
      },
      height: 500,
    },
    // colors: [
    //   primarylight,
    //   primary,
    //   primary,
    //   primarylight,
    //   primarylight,
    //   primarylight,
    // ],
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: "30%",
        distributed: true,
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    xaxis: {
      categories: xvalues,
      axisBorder: {
        show: false,
      },
    },
    yaxis: {},
    tooltip: {
      theme: theme.palette.mode === "dark" ? "dark" : "light",
    },
  };
  const seriescolumnchart = [
    {
      name: "Number of correct answers",
      data: yvalues,
    },
  ];

  return (
    <Chart
      options={optionscolumnchart}
      series={seriescolumnchart}
      type="bar"
      height="500px"
    />
  );
};

export default BarChart;
