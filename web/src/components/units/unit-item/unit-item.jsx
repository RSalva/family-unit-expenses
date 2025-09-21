function UnitItem({ unit, onClick }) {
   return (
    <div 
      className="card shadow-sm mb-4" 
      onClick={onClick} 
      style={{ cursor: onClick ? 'pointer' : 'default' }}>
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

        {/* Created Date */}
        <div className="text-muted">
          <small>
            <i className="fa fa-calendar-alt me-2"></i>
            Created on: {new Date(unit.createdAt).toLocaleDateString()}
          </small>
        </div>
      </div>
    </div>
  );
}

export default UnitItem;