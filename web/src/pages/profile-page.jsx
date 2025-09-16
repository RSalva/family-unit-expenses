import { useAuth } from "../contexts/auth";
import { UserProfile } from "../components/users";
import { PageLayout } from "../components/layouts";

function ProfilePage() {
  const { user } = useAuth();
  return (
    <PageLayout>
      <div className="container mt-5">
        <h1 className="mb-4">My Profile</h1>
        <div className="card shadow-sm">
          <div className="card-body">
            <UserProfile
              user={user}
            />
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

export default ProfilePage;