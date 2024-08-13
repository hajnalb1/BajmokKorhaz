import React, { useState, useEffect } from "react";

import {
  fetchPatientsWithDoctorNames,
  sendPatientHome,
  deletePatient,
  deleteMessage,
} from "../appFunction/Functions";

import Loader from "../ui/Loader";

import PaciensAdatok from "./PaciensAdatok";

export default function PaciensekLista({ render, setRender }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteMessage, setShowDeleteMessage] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState(null);

  useEffect(() => {
    fetchPatientsWithDoctorNames(setLoading, setPatients, setError); // Funkció hívása
  }, [render]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Patients List</h1>
      <div className="card-container">
        {patients.map((patient) => (
          <div className="card" key={patient._id}>
            <PaciensAdatok
              patient={patient}
              render={render}
              setRender={setRender}
              deleteMessage={() =>
                deleteMessage(
                  patient._id,
                  setSelectedPatientId,
                  setShowDeleteMessage
                )
              }
              sendPatientHome={() =>
                sendPatientHome(patient._id, setRender, render)
              }
              showDeleteMessage={showDeleteMessage}
              selectedPatientId={selectedPatientId}
              deletePatientFromPatientListAndDoctor={() =>
                deletePatient(
                  patient._id,
                  setPatients,
                  patients,
                  setRender,
                  render,
                  setShowDeleteMessage,
                  setError
                )
              }
              setShowDeleteMessage={setShowDeleteMessage}
              justData={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
