import React from "react";
import EditPatientName from "./EditpatientName";
import Button from "../ui/Button";
import Deletemessage from "../ui/Deletemessage";

export default function PaciensAdatok({
  patient,
  render,
  setRender,
  deleteMessage,
  sendPatientHome,
  showDeleteMessage,
  selectedPatientId,
  deletePatientFromPatientListAndDoctor,
  setShowDeleteMessage,
}) {
  return (
    <div key={patient._id}>
      <div style={{ textAlign: "center", margin: "5px 0" }}>
        {" "}
        <EditPatientName
          className={"megerosites-button"}
          patient={patient}
          render={render}
          setRender={setRender}
        />
        <p style={{ margin: "20px 0" }}>Kor: {patient.kor}</p>
        <p style={{ margin: "20px 0" }}>Betegsége: {patient.betegseg}</p>
        <p style={{ margin: "20px 0" }}>Doktor neve: {patient.doctorName}</p>
      </div>
      <>
        <div className="button-container">
          <Button
            className={"deleteGomb"}
            name={"Törlés"}
            onClick={() => deleteMessage(patient._id)}
            disabled={!patient.aktiv}
          />
          <Button
            className={"mrsKuciGomb"}
            name={"Mrss kuci"}
            onClick={() => sendPatientHome(patient._id)}
            disabled={!patient.aktiv}
          />
        </div>
        {showDeleteMessage && selectedPatientId === patient._id && (
          <Deletemessage
            setState={setShowDeleteMessage}
            del={deletePatientFromPatientListAndDoctor}
            id={selectedPatientId}
          />
        )}
      </>
    </div>
  );
}
