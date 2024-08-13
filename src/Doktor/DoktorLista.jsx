import React, { useEffect, useState } from "react";
import Button from "../ui/Button";
import Deletemessage from "../ui/Deletemessage";
import Input from "../ui/Input";
import EditDoktorName from "./EditDoktorName";
import EditDoktorSpeciality from "./EditDoktorSpeciality";

import PaciensekListaAdoktoroknal from "./PaciensekListaAdoktorknal";
import {
  fetchPatients,
  deleteDoctor,
  filterDoctors,
} from "../appFunction/Functions"; // Importálás

export default function Doctors({
  setDoctors,
  render,
  setRender,
  doctors,
  setError,
  loading,
  error,
}) {
  const [deleteMessage, setDeleteMessage] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchSpeciality, setSearchSpeciality] = useState("");
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // Állapot a felugró ablakhoz
  const [showImage, setShowImage] = useState(false);

  const showDeleteMessage = (id) => {
    setSelectedDoctorId(id);
    setDeleteMessage(true);
  };

  const handlePatientChange = (event) => {
    setSelectedPatientId(event.target.value);
    setIsModalOpen(true); // Megnyitjuk a modális ablakot
  };

  useEffect(() => {
    fetchPatients(setPatients, setError);
  }, [render]);

  const closeModal = () => {
    setIsModalOpen(false); // Bezárjuk a modális ablakot
    setSelectedPatientId(""); // Töröljük a kiválasztott pácienst
  };

  const filteredDoctors = filterDoctors(doctors, searchTerm, searchSpeciality);

  useEffect(() => {
    console.log("Fil eltered doctors:", filteredDoctors);
  }, [filteredDoctors]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div>
      <h1
        style={{
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        Doktoraink
      </h1>

      <div className="doktor-lista">
        <Input
          inputneve="Search by name"
          state={searchTerm}
          setState={setSearchTerm}
          type="text"
          id="search"
        />
        <Input
          inputneve="Search by Speciality"
          state={searchSpeciality}
          setState={setSearchSpeciality}
          type="text"
          id="search"
        />
      </div>
      <br />
      <div className="card-container">
        {filteredDoctors.map((doctor) => (
          <div className="card" key={doctor._id}>
            <EditDoktorName
              doctor={doctor}
              render={render}
              setRender={setRender}
            />
            <EditDoktorSpeciality
              doctor={doctor}
              render={render}
              setRender={setRender}
            />

            <div>
              <h4> Paciensek</h4>
              <select value={selectedPatientId} onChange={handlePatientChange}>
                <option value="" disabled>
                  Select patient
                </option>
                {doctor.patients && doctor.patients.length > 0 ? (
                  doctor.patients.map((patientId) => {
                    const patient = patients.find((p) => p._id === patientId);
                    return (
                      <option key={patientId} value={patientId}>
                        {patient ? patient.name : "Unknown"}{" "}
                      </option>
                    );
                  })
                ) : (
                  <option>No patients assigned</option>
                )}
              </select>
            </div>
            <br />
            <Button
              onClick={() => {
                showDeleteMessage(doctor._id);
                setShowImage(true);
                setTimeout(() => {
                  setShowImage(false);
                }, 3000); // 3 másodperc után eltűnik a kép
              }}
              name={"Törlés"}
              className={"deleteGomb"}
            />
            {deleteMessage && selectedDoctorId === doctor._id && (
              <Deletemessage
                setState={setDeleteMessage}
                del={() =>
                  deleteDoctor(
                    selectedDoctorId,
                    setDoctors,
                    doctors,
                    setError,
                    setDeleteMessage
                  )
                } // Importált függvény használata
                id={selectedDoctorId}
              />
            )}
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div style={modalStyle}>
          <PaciensekListaAdoktoroknal
            patientId={selectedPatientId}
            onClose={closeModal}
          />
        </div>
      )}
      {showImage && (
        <div className="image-container">
          <img src="/images.png" alt="Notification" className="fade-in-out" />
        </div>
      )}
    </div>
  );
}

const modalStyle = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  background: "white",
  padding: "20px",
  borderRadius: "8px",
  zIndex: 1000,
};
