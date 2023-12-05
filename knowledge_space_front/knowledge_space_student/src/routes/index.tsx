import { QuestionsPage } from "@pages/questions/QuestionsPage";
import React from "react";
import { createBrowserRouter } from "react-router-dom";

const FullLayout = React.lazy(() => import("@layout/full/FullLayout"));
const ErrorPage = React.lazy(() => import("@pages/error/ErrorPage"));
const NotFoundPage = React.lazy(() => import("@pages/error/NotFoundPage"));
const LayoutUnauth = React.lazy(() => import("@layout/LayoutUnauth"));
const LoginPage = React.lazy(() => import("@pages/auth/LoginPage"));
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
        id: "assessment_tests",
        path: "/",
        children: [
          {
            index: true,
            element: <AssessmentTestPage />,
            errorElement: <ErrorPage />,
          },
          {
            id: "questions",
            path: "assessment_tests/:assessmentTestId/questions",
            element: <QuestionsPage />,
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
