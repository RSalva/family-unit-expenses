import { PageLayout } from '../components/layouts';

function ErrorPage({ code, message }) {
  return (
    <PageLayout>
      <div>
        <h1>{code}</h1>
        <p>{message}</p>
      </div>
    </PageLayout>
  );
};

export function ForbiddenPage() {
  return <ErrorPage code={403} message="You do not have permission to access this resource." />;
}

export function NotFoundPage() {
  return <ErrorPage code={404} message="The page you are looking for does not exist." />;
}