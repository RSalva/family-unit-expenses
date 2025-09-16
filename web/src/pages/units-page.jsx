import { PageLayout } from "../components/layouts";
import { UnitsList } from "../components/units";

function UnitsPage() {
  return (
    <PageLayout>
      <h4 className="fw-light mb-2">Units List</h4>
      <UnitsList />
    </PageLayout>
  )
};

export default UnitsPage;

