import React from "react";
import { createBrowserRouter } from "react-router-dom";
import queryClient from "../query-client";
import { getKsGraphData } from "@api/ksGraph/ksGraph";

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
                queryKey: ["problems", 1],
                queryFn: () => getKsGraphData(1),
              }),
          },
          {
            id: "assessment_tests",
            path: "assessment_tests",
            element: <AssessmentTestPage />,
            errorElement: <ErrorPage />,
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
