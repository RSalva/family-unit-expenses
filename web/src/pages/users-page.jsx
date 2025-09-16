import { PageLayout } from "../components/layouts";
import { UsersList } from "../components/users";

function UsersPage() {
  return (
    <PageLayout>
      <h4 className="fw-light mb-2">Users List</h4>
      <UsersList />
    </PageLayout>
  )
}

export default UsersPage;