import { PageLayout } from "../components/layouts";
import { UnitDetail } from "../components/units";
import { useAuth } from "../contexts/auth";

function UnitDetailPage() {
  const { user } = useAuth();
  return (
    <PageLayout>
      <h4 className="fw-light mb-2">Unit Detail</h4>
      <UnitDetail currentUser={user}/>
    </PageLayout>
  )
};

export default UnitDetailPage;

