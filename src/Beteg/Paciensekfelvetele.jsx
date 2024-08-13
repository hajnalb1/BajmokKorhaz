import React, { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";

import { handleSubmit } from "../appFunction/Functions";

export default function PaciensekFelvetele({ doctors, render, setRender }) {
  const [patientName, setPatientName] = useState("");
  const [patientKor, setPatientKor] = useState("");
  const [patientBetegsege, setPatientBetegsege] = useState("");
  const [doctorId, setDoctorId] = useState("");

  const handleSubmitWrapper = () => {
    handleSubmit(
      patientName,
      patientKor,
      patientBetegsege,
      doctorId,
      setPatientName,
      setPatientKor,
      setPatientBetegsege,
      setRender,
      render
    );
  };

  return (
    <div>
      <Input
        inputneve={"Paciens neve"}
        state={patientName}
        setState={setPatientName}
        type="text"
        id="patientName"
      />
      <Input
        inputneve={"Paciens kora"}
        state={patientKor}
        setState={setPatientKor}
        type={"date"}
        id="pacienskora"
      />
      <Input
        inputneve={"Paciens betegsége"}
        state={patientBetegsege}
        setState={setPatientBetegsege}
        type={"text"}
        id="paciensbetegsege"
      />
      <select
        onChange={(e) => {
          const selectedId = e.target.value;
          setDoctorId(selectedId);
        }}
        value={doctorId}
        required
      >
        <option value="">Select an option</option>
        {doctors.map((doctor) => (
          <option key={doctor._id} value={doctor._id}>
            {doctor.nev}
          </option>
        ))}
      </select>
      <Button
        onClick={handleSubmitWrapper}
        name={"Add Patient"}
        disabled={
          patientName.trim().length < 3 ||
          patientKor === "" ||
          patientBetegsege.trim().length < 3
        }
      />
    </div>
  );
}
