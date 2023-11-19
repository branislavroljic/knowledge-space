import { Link } from "react-router-dom";

interface ErrorProps {
  code?: number;
  message?: string;
  explanation?: string;
}

export default function ErrorPage({ code }: ErrorProps) {
  return (
    <>
      <div className="min-h-full py-16 px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
        <div className="mx-auto max-w-max">
          <main className="sm:flex">
            <p className="text-4xl font-bold tracking-tight text-primary-600 sm:text-5xl">
              {code || 500}
            </p>
            <div className="sm:ml-6">
              <div className="sm:border-l sm:border-gray-200 sm:pl-6">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                  {"Oops, something went wrong."}
                </h1>
                <p className="mt-1 text-base text-gray-500">
                  {"Please try again later."}
                </p>
              </div>
              <div className="mt-10 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6">
                <Link
                  to="/"
                  className="inline-flex items-center rounded-md border border-transparent 
                  bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm
                   hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  {"Go back to home"}
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

export function LoadingErrorPage() {
  return (
    <ErrorPage
      code={500}
      message={"Loading error"}
      explanation={
        "An error occurred while loading the necessary data for the page."
      }
    />
  );
}
