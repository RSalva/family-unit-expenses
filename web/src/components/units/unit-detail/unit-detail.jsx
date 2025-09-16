function UnitDetail({ unit }) {
  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        {/* Unit Header */}
        <div className="d-flex align-items-center mb-3">
          <img
            src={unit.icon}
            alt={`${unit.name} icon`}
            className="rounded-circle me-3"
            style={{ width: "60px", height: "60px", objectFit: "cover" }}
          />
          <div>
            <h5 className="card-title mb-0">{unit.name}</h5>
            <p className="text-muted mb-0">{unit.description}</p>
          </div>
        </div>

        {/* Users Section */}
        <div className="mb-3">
          <h6 className="fw-bold">Users</h6>
          <div className="d-flex flex-wrap">
            {unit.users.map((user) => (
              <div
                key={user.id}
                className="d-flex align-items-center me-3 mb-2"
              >
                <img
                  src={user.avatar}
                  alt={`${user.name}'s avatar`}
                  className="rounded-circle me-2"
                  style={{ width: "40px", height: "40px", objectFit: "cover" }}
                />
                <span>{user.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Expenses Section */}
        <div>
          <h6 className="fw-bold">Expenses</h6>
          <ul className="list-group">
            {unit.expenses.map((expense) => (
              <li key={expense.id} className="list-group-item">
                <div className="d-flex justify-content-between">
                  <span>{expense.description}</span>
                  <span className="fw-bold">${expense.cost.toFixed(2)}</span>
                </div>
                <small className="text-muted">
                  Paid by: {expense.paidBy.name}
                </small>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default UnitDetail;