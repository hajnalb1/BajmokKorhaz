import React, { useState, useEffect } from "react";
import { fetchPatientDetails } from "../appFunction/Functions";

export default function PaciensekListaAdoktoroknal({ patientId, onClose }) {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPatientDetails = async () => {
      try {
        const patientData = await fetchPatientDetails(patientId);
        setPatient(patientData);
      } catch (err) {
        setError("Nem sikerult a fetchelni a pacienst");
      } finally {
        setLoading(false);
      }
    };
    loadPatientDetails();
  }, [patientId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!patient) {
    return <div>No patient found</div>;
  }

  return (
    <div style={{ background: "white", padding: "20px", borderRadius: "8px" }}>
      <div
        style={{
          border: "1px solid grey",
          width: "200px",
          marginBottom: "10px",
        }}
      >
        <p>Név: {patient.name}</p>
        <p>Kor: {patient.kor}</p>
        <p>Betegsége: {patient.betegseg}</p>
        <p>Doktor neve: {patient.doctorName}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
