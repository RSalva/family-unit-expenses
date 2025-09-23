import React, { useEffect, useState } from "react";
import UnitItem from "../unit-item/unit-item";
import * as UnitsApi from "../../../services/units-api";
import { useNavigate, Link } from "react-router";

function UnitsList() {
  const [units, setUnits] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUnits() {
      const units = await UnitsApi.getUnits();
      setUnits(units);
    }
    fetchUnits();
  }, []);

  const handleUnitClick = (id) => {
    navigate(`/units/${id}`);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary">Units</h2>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/units/create")}
        >
          Create New Unit
        </button>
      </div>
      {units.length === 0 ? (
        <div className="text-center p-4 bg-light rounded shadow-sm">
          <i className="fa fa-folder-open text-muted fa-3x mb-3"></i>
          <p className="text-muted">There are no units to show. Create a new unit!</p>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/units/create")}
          >
            Create New Unit
          </button>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {units.map((unit) => (
            <div key={unit.id} className="col">
              <UnitItem unit={unit} onClick={() => handleUnitClick(unit.id)} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UnitsList;

