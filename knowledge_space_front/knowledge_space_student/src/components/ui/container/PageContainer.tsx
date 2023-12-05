import { Helmet, HelmetProvider } from "react-helmet-async";

type Props = {
  description?: string;
  children: JSX.Element | JSX.Element[];
  title?: string;
};

const app_name = import.meta.env.VITE_APP_NAME;

const PageContainer = ({ title = app_name, description, children }: Props) => (
  <HelmetProvider>
    <div>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Helmet>
      {children}
    </div>
  </HelmetProvider>
);

export default PageContainer;
