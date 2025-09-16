import { Link } from "react-router";
import { LoginForm } from "../components/auth";
import { PageLayout } from "../components/layouts";

function LoginPage() {
  return (
    <PageLayout>
      <div className="row justify-content-center">
        <div className="col-12 col-md-6 col-lg-4">
          <h3 className="fw-light">Login</h3>
          <LoginForm to="/users" />
          <hr className="my-2"/>
          <Link to="/register" className="btn btn-secondary fw-light w-100 btn-sm">REGISTER</Link>
        </div>
      </div>
      
    </PageLayout>
  )
}

export default LoginPage;