import React, { useState } from "react";
import axios from "axios";
import Button from "../ui/Button";

const EditDoktorSpeciality = ({ doctor, render, setRender }) => {
  const [edit, setEdit] = useState(false);
  const [editedValue, setEditedValue] = useState(doctor.szak);

  const editDoctorSpeciality = async (id, newSpeciality) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/updateDoctorSpeciality/${id}`,
        { szak: newSpeciality }
      );
      console.log("Doctor speciality updated:", response.data);
      setRender(render + 1);
    } catch (error) {
      console.error(
        "Error updating doctor speciality:",
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
      }}
    >
      {edit === false ? (
        <p
          style={{
            margin: "0 auto",
            marginBottom: "8px",
            marginTop: "24px",
          }}
        >
          Szak: {doctor.szak}
        </p>
      ) : (
        <input
          style={{
            margin: "0 auto",
          }}
          type="text"
          value={editedValue}
          onChange={(e) => setEditedValue(e.target.value)}
        />
      )}
      <Button
        className={`megerosites-button ${edit ? "save-mode" : ""}`}
        onClick={() => {
          if (edit) {
            editDoctorSpeciality(doctor._id, editedValue);
          }
          setEdit(!edit);
        }}
        name={!edit ? "Módositás" : "Mentés"}
        disabled={editedValue.length < 3}
      />
    </div>
  );
};

export default EditDoktorSpeciality;
