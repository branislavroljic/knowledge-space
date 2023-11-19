import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "./query-client";
import Spinner from "@ui/view/spinner/Spinner";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Suspense
        fallback={
          <div className="absolute left-[50%] top-[50%] z-20 flex h-full w-full -translate-x-1/2 -translate-y-1/2 items-center justify-center">
            <Spinner />
          </div>
        }
      >
        <App />
      </Suspense>
    </QueryClientProvider>
  </React.StrictMode>
);
