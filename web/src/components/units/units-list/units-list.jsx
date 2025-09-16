import React, { useEffect, useState } from "react";
import UnitItem from "../unit-item/unit-item";
import * as UnitsApi from "../../../services/units-api";

function UnitsList() {
  console.l
  const [units, setUnits] = useState([]);

  useEffect(() => {
    async function fetchUnits() {
      const units = await UnitsApi.getUnits();
      setUnits(units);
    }
    fetchUnits();
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="mb-4">My Units</h1>
      {units?.map((unit) => (
        <UnitItem key={unit.id} unit={unit} />
      ))}
    </div>
  );
}

export default UnitsList;

