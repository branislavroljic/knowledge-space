import React from "react";
import { createBrowserRouter } from "react-router-dom";
import queryClient from "../query-client";
import { getKnowledgeSpaces } from "@api/ksGraph/knowledgeSpace";
import { QuestionsPage } from "@pages/questions/QuestionsPage";
import StatisticsPage from "@pages/statistics/StatisticsPage";

const FullLayout = React.lazy(() => import("@layout/full/FullLayout"));
const ErrorPage = React.lazy(() => import("@pages/error/ErrorPage"));
const NotFoundPage = React.lazy(() => import("@pages/error/NotFoundPage"));
const LayoutUnauth = React.lazy(() => import("@layout/LayoutUnauth"));
const LoginPage = React.lazy(() => import("@pages/auth/LoginPage"));
const KSGraphPage = React.lazy(() => import("@pages/ks-graph/KSGraphPage"));
const AssessmentTestPage = React.lazy(
  () => import("@pages/assessment-test/AssessmentTestPage")
);

const browserConfig = createBrowserRouter([
  {
    id: "layout-auth",
    path: "/",
    element: <FullLayout />,
    children: [
      {
        id: "ks_graph",
        path: "/",
        children: [
          {
            index: true,
            element: <KSGraphPage />,
            errorElement: <ErrorPage />,
            loader: () =>
              queryClient.fetchQuery({
                queryKey: ["knowledgeSpaces"],
                queryFn: () => getKnowledgeSpaces(),
              }),
            // loader: () =>
            //   queryClient.fetchQuery({
            //     queryKey: ["problems", 1],
            //     queryFn: () => getKsGraphData(1),
            //   }),
          },
          {
            id: "assessment_tests",
            path: "assessment_tests",
            children: [
              {
                index: true,
                element: <AssessmentTestPage />,
                errorElement: <ErrorPage />,
              },
              {
                id: "questions",
                path: ":assessmentTestId/questions",
                element: <QuestionsPage />,
                errorElement: <ErrorPage />,
              },
              {
                id: "statistics",
                path: ":assessmentTestId/statistics",
                element: <StatisticsPage />,
                errorElement: <ErrorPage />,
              },
            ],
          },
        ],
      },
      {
        id: "notFound",
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
  {
    id: "layout-unatuh",
    element: <LayoutUnauth />,
    children: [
      {
        id: "login",
        path: "/login",
        element: <LoginPage />,
      },
    ],
  },
]);

export default browserConfig;
