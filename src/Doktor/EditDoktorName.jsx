import React, { useState } from "react";
import axios from "axios";
import Button from "../ui/Button";
import Input from "../ui/Input";

const EditDoktorName = ({ doctor, render, setRender }) => {
  const [edit, setEdit] = useState(false);
  const [editedValue, setEditedValue] = useState(doctor.nev);

  const editDoctorName = async (id, newName) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/updateDoctorName/${id}`,
        { name: newName }
      );
      console.log("Doctor updated:", response.data);
      setRender(render + 1);
    } catch (error) {
      console.error(
        "Error updating doctor:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      {edit === false ? (
        <div>
          <p>Név: {doctor.nev}</p>
        </div>
      ) : (
        <input
          className="styled-input"
          type="text"
          value={editedValue}
          onChange={(e) => setEditedValue(e.target.value)}
        />
      )}
      <Button
        className={`megerosites-button ${edit ? "save-mode" : ""}`}
        onClick={() => {
          if (edit) {
            editDoctorName(doctor._id, editedValue);
          }
          setEdit(!edit);
        }}
        name={!edit ? "Módositás" : "Mentés"}
        disabled={editedValue.length < 3}
      />
    </div>
  );
};

export default EditDoktorName;
