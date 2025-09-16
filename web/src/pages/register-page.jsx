import { Link } from "react-router";
import { RegisterForm } from "../components/auth";
import { PageLayout } from "../components/layouts";

function RegisterPage() {
  return (
    <PageLayout>
      <div className="row justify-content-center">
        <div className="col-12 col-md-6 col-lg-4">
          <h3 className="fw-light">Register</h3>
          <RegisterForm to="/users" />
          <hr className="my-2"/>
          <Link to="/login" className="btn btn-secondary fw-light w-100 btn-sm">LOGIN</Link>
        </div>
      </div>
      
    </PageLayout>
  )
}

export default RegisterPage;