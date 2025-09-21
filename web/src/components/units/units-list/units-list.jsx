import React, { useEffect, useState } from "react";
import UnitItem from "../unit-item/unit-item";
import * as UnitsApi from "../../../services/units-api";
import { useNavigate, Link } from "react-router";

function UnitsList() {
  console.l
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
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="mb-4">My Units</h1>
          <Link to="/units/create" className="btn btn-primary">
            + Create New Unit
          </Link>
      </div>
      {units?.map((unit) => (
        <UnitItem key={unit.id} unit={unit} onClick={() => handleUnitClick(unit.id)} />
      ))}
    </div>
  );
}

export default UnitsList;

