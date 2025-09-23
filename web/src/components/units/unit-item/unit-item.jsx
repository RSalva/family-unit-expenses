function UnitItem({ unit, onClick }) {
  return (
    <div className="card shadow-sm h-100 border-0" style={{ cursor: "pointer" }}>
      <div className="card-body d-flex flex-column">
        <div className="d-flex align-items-center mb-3">
          <img
            src={unit.icon}
            alt={`${unit.name} icon`}
            className="rounded-circle me-3 border border-primary shadow-sm"
            style={{ width: "60px", height: "60px", objectFit: "cover" }}
          />
          <h5 className="card-title mb-0 text-primary fw-bold">{unit.name}</h5>
        </div>
        <p className="card-text text-muted flex-grow-1" style={{ fontSize: "0.9rem" }}>
          {unit.description}
        </p>
        <div className="d-flex justify-content-end">
          <button
            className="btn btn-primary btn-sm px-3 shadow-sm"
            onClick={onClick}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default UnitItem;