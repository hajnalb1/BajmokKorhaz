import axios from "axios";

// Funkció a páciens adatainak lekérésére
export const fetchPatientDetails = async (patientId) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/patients/${patientId}`
    );
    const patientData = response.data;

    if (patientData.doctor) {
      const doctorResponse = await axios.get(
        `http://localhost:5000/getDoctorById/${patientData.doctor}`
      );
      patientData.doctorName = doctorResponse.data.nev;
    } else {
      patientData.doctorName = "N/A";
    }

    return patientData; // Visszaadjuk a páciens adatokat
  } catch (err) {
    throw new Error("Nem sikerült a páciens adatainak lekérése");
  }
};

export const fetchDoctorById = async (id) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/getDoctorById/${id}`
    );
    return response.data; // Doktor adatai
  } catch (err) {
    console.error("Failed to fetch doctor:", err);
    return { nev: "N/A" }; // Hibás lekérdezés esetén "N/A"
  }
};

// Funkció a páciens adatok lekérésére, doktor nevével együtt
export const fetchPatientsWithDoctorNames = async (
  setLoading,
  setPatients,
  setError
) => {
  setLoading(true); // Az állapot beállítása betöltés közben
  try {
    // Az összes páciens lekérése
    const response = await axios.get("http://localhost:5000/patients");

    // Az összes páciens adatának feldolgozása, hogy hozzáadjuk a doktor nevét
    const patientsWithDoctorNames = await Promise.all(
      response.data.map(async (patient) => {
        if (patient.doctor) {
          // A doktor adatainak lekérése az ID alapján
          const doctor = await fetchDoctorById(patient.doctor);
          // A páciens adatok kiegészítése a doktor nevével
          return { ...patient, doctorName: doctor.nev };
        }
        // Ha nincs doktor azonosító, a doktor neve "N/A"
        return { ...patient, doctorName: "N/A" };
      })
    );

    // Az állapot frissítése a feldolgozott páciens adatokkal
    setPatients(patientsWithDoctorNames);
    setError(null); // Hiba állapot nullázása, ha sikeres volt a lekérdezés
    console.log(response.data, "ez a response data"); // Debug üzenet a konzolba
  } catch (err) {
    // Hiba állapot beállítása, ha a lekérdezés sikertelen volt
    setError("Failed to fetch patients");
    setPatients([]); // Üres páciens lista beállítása
  } finally {
    // Betöltés állapot beállítása hamisra, a művelet végeztével
    setLoading(false);
  }
};

export const sendPatientHome = async (id, setRender, render) => {
  try {
    const response = await axios.put(
      `http://localhost:5000/updatePatientStatus/${id}`,
      { aktiv: false, kiengedesdatuma: new Date() }
    );
    console.log("Patient updated:", response.data);
    setRender(render + 1);
  } catch (error) {
    console.error(
      "Error updating patient:",
      error.response ? error.response.data : error.message
    );
  }
};

export const deletePatient = async (
  id,
  setPatients,
  patients,
  setRender,
  render,
  setShowDeleteMessage,
  setError
) => {
  try {
    console.log(`Attempting to delete patient with ID: ${id}`);

    const response = await fetch(`http://localhost:5000/patients/${id}`, {
      method: "DELETE",
    });
    console.log(`Delete response status: ${response.status}`);

    if (!response.ok) {
      throw new Error("Failed to delete patient");
    }

    console.log("Patient deleted successfully");
    setPatients(patients.filter((patient) => patient._id !== id));
    setRender(render + 1);
    setShowDeleteMessage(false);
  } catch (error) {
    console.error("Failed to delete patient", error);
    setError("Failed to delete patient");
  }
};

// Beállítja a törlendő páciens ID-jét és megjeleníti a törlési üzenetet
export const deleteMessage = (
  id,
  setSelectedPatientId,
  setShowDeleteMessage
) => {
  setSelectedPatientId(id);
  setShowDeleteMessage(true);
};

export const handleSubmit = async (
  patientName,
  patientKor,
  patientBetegsege,
  doctorId,
  setPatientName,
  setPatientKor,
  setPatientBetegsege,
  setRender,
  render
) => {
  if (!patientName || !patientKor || !patientBetegsege || !doctorId) {
    return;
  }
  try {
    const req = await axios.post("http://localhost:5000/addPatient", {
      name: patientName,
      kor: patientKor,
      betegseg: patientBetegsege,
      felveteldatuma: new Date(),
      kiengedesdatuma: null,
      aktiv: true,
      doctor: doctorId,
    });

    const patientId = req.data._id; // Feltételezzük, hogy a válasz tartalmazza az új páciens ID-t
    if (!patientId) {
      console.error("A páciens ID nem található a válaszban.");
      return;
    }

    try {
      const linkResponse = await axios.post(
        "http://localhost:5000/linkPatientToDoctor",
        {
          doctorId: doctorId,
          patientId: patientId,
        }
      );
      console.log(linkResponse);
    } catch (error) {
      console.error("Error linking patient to doctor:", error);
    }

    setPatientName(""); // Input mezők resetelése
    setPatientKor("");
    setPatientBetegsege("");
  } catch (error) {
    console.error("Error adding patient:", error);
  }
  setRender(render + 1);
};

export const editPatientName = async (id, newName, setRender, render) => {
  try {
    const response = await axios.put(
      `http://localhost:5000/updatePatientName/${id}`,
      { name: newName }
    );
    console.log("Patient updated:", response.data);
    setRender(render + 1);
  } catch (error) {
    console.error(
      "Error updating patient:",
      error.response ? error.response.data : error.message
    );
  }
};

// Functions.js
export const handleDoctorSubmit = async ({
  event,
  nev,
  kor,
  szak,
  isSubmitting,
  setIsSubmitting,
  setLoading,

  setError,
  setNev,
  setKor,
  setSzak,
  setRender,
  render,
}) => {
  event.preventDefault();
  if (!nev || !kor || !szak) {
    setIsSubmitting(false);
    return;
  }

  if (isSubmitting) return; // Ha már folyamatban van a beküldés, ne csináljunk semmit

  setIsSubmitting(true); // Beküldés kezdete
  setLoading(true);
  setError(null);

  try {
    const response = await axios.post("http://localhost:5000/addDoctor", {
      nev,
      kor,
      szak,
    });

    if (response.status !== 200) {
      throw new Error("Failed to submit");
    }

    const data = response.data;
    console.log(data);

    setNev("");
    setKor("");
    setSzak("");
    setRender(render + 1);
  } catch (err) {
    setError(err.message);
  } finally {
    setIsSubmitting(false);
    setLoading(false);
  }
};

export const fetchPatients = async (setPatients, setError) => {
  try {
    const response = await axios.get("http://localhost:5000/patients");
    setPatients(response.data);
  } catch (err) {
    setError("Failed to fetch patients");
  }
};

export const deleteDoctor = async (
  id,
  setDoctors,
  doctors,
  setError,
  setDeleteMessage
) => {
  try {
    const response = await fetch(`http://localhost:5000/doctor/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete doctor");
    }
    setDoctors(doctors.filter((doctor) => doctor._id !== id));
  } catch (err) {
    setError(err.message);
  } finally {
    setDeleteMessage(false);
  }
};

export const filterDoctors = (doctors, searchTerm, searchSpeciality) => {
  return doctors.filter(
    (doctor) =>
      doctor.nev.toLowerCase().includes(searchTerm.toLowerCase()) &&
      doctor.szak.toLowerCase().includes(searchSpeciality.toLowerCase())
  );
};
