import { PageLayout } from "../components/layouts";
import { Link } from "react-router";
import { UnitCreateForm } from "../components/units";
import { useAuth } from "../contexts/auth";

function UnitCreationPage() {
  const { user } = useAuth();
  return (
    <PageLayout>
      <div className="row justify-content-center">
        <div className="col-12 col-md-6 col-lg-4">
          <h3 className="fw-light">Create Unit</h3>
          <UnitCreateForm currentUser={user} />
          <hr className="my-2" />
          <Link to="/units" className="btn btn-secondary fw-light w-100 btn-sm">BACK TO UNITS</Link>
        </div>
      </div>
    </PageLayout>
  );
}

export default UnitCreationPage;
