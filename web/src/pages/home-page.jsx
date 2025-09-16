import { Link } from "react-router";
import { PageLayout } from "../components/layouts";

function HomePage() {
  return (
    <PageLayout>
      <div className="container text-center mt-5">
        {/* Hero Section */}
        <div className="row justify-content-center">
          <div className="col-md-8">
            <h1 className="display-4 fw-bold">Welcome to Family Unit Expenses</h1>
            <p className="lead text-muted">
              Simplify your family expense tracking and sharing. Keep everything organized and split expenses effortlessly.
            </p>
          </div>
        </div>

        {/* Call-to-Action Buttons */}
        <div className="row justify-content-center mt-4">
          <div className="col-md-4">
            <Link to="/register" className="btn btn-primary btn-lg w-100 mb-3">
              Get Started
            </Link>
          </div>
          <div className="col-md-4">
            <Link to="/login" className="btn btn-outline-secondary btn-lg w-100">
              Log In
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="row justify-content-center mt-5">
          <div className="col-md-10">
            <h2 className="fw-bold">Why Choose Family Unit Expenses?</h2>
            <div className="row mt-4">
              <div className="col-md-4">
                <i className="fa fa-users fa-3x text-primary"></i>
                <h4 className="mt-3">Collaborate with Family</h4>
                <p className="text-muted">
                  Add family members to your unit and track shared expenses together.
                </p>
              </div>
              <div className="col-md-4">
                <i className="fa fa-calculator fa-3x text-primary"></i>
                <h4 className="mt-3">Simplify Expense Splitting</h4>
                <p className="text-muted">
                  Automatically calculate who owes what and settle balances easily.
                </p>
              </div>
              <div className="col-md-4">
                <i className="fa fa-chart-line fa-3x text-primary"></i>
                <h4 className="mt-3">Track Your Spending</h4>
                <p className="text-muted">
                  Get insights into your spending habits and manage your finances better.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

export default HomePage;