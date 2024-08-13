import React, { useState } from "react";
import axios from "axios";
import Button from "../ui/Button";

import { editPatientName } from "../appFunction/Functions"; // Importáljuk a függvényt

const EditPatientName = ({ patient, render, setRender }) => {
  const [edit, setEdit] = useState(false);
  const [editedValue, setEditedValue] = useState(patient.name || "");

  const handleEditPatientName = () => {
    editPatientName(patient._id, editedValue, setRender, render);
    setEdit(false);
  };

  return (
    <>
      {edit === false ? (
        <div>
          <p>Név: {patient.name || "N/A"}</p>
        </div>
      ) : (
        <input
          type="text"
          value={editedValue}
          onChange={(e) => setEditedValue(e.target.value)}
        />
      )}
      <Button
        className={`megerosites-button ${edit ? "save-mode" : ""}`}
        onClick={() => {
          if (edit) {
            handleEditPatientName(patient._id, editedValue);
          }
          setEdit(!edit);
        }}
        name={!edit ? "Módosítás" : "Mentés"}
        disabled={editedValue.length < 3 || patient.aktiv === false}
      />
    </>
  );
};

export default EditPatientName;
