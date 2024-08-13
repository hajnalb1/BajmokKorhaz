const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");

const app = express();
const uri =
  "mongodb+srv://bencehajnal448:yGvu6T6KRfTj3fsW@cluster0.fwg0ym0.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

app.use(express.json());
app.use(cors());

// Kapcsolódás a MongoDB-hez egyszer a szerver indításakor
let db;

client
  .connect()
  .then(() => {
    db = client.db("BajmokKorhaz");
    console.log("Connected to MongoDB");
    app.listen(5000, () => {
      console.log("Server running on port 5000");
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  });

app.post("/addDoctor", async (req, res) => {
  try {
    const collection = db.collection("Doktorok");
    const result = await collection.insertOne(req.body);
    res.status(200).send(`New doctor inserted with _id: ${result.insertedId}`);
  } catch (error) {
    console.error("Error inserting doctor:", error);
    res.status(500).send("Error inserting doctor");
  }
});

app.get("/doctors", async (req, res) => {
  try {
    const collection = db.collection("Doktorok");
    const doctors = await collection.find({}).toArray();
    res.status(200).json(doctors);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).send("Error fetching doctors");
  }
});

app.delete("/doctor/:id", async (req, res) => {
  try {
    const doctorId = req.params.id;
    if (!ObjectId.isValid(doctorId)) {
      return res.status(400).send("Invalid ID format");
    }

    const collection = db.collection("Doktorok");
    const objectId = new ObjectId(doctorId);
    console.log(`Attempting to delete doctor with id: ${objectId}`);
    const result = await collection.deleteOne({ _id: objectId });
    if (result.deletedCount === 1) {
      res.status(200).send("Doctor deleted");
    } else {
      res.status(404).send("Doctor not found");
    }
  } catch (error) {
    console.error("Error deleting doctor:", error);
    res.status(500).send("Error deleting doctor");
  }
});
app.put("/updateDoctorName/:id", async (req, res) => {
  const doctorId = req.params.id;

  console.log(`PUT request received for doctor with ID: ${doctorId}`);

  try {
    if (!ObjectId.isValid(doctorId)) {
      console.log("Invalid ID format");
      return res.status(400).send("Invalid ID format");
    }

    const collection = db.collection("Doktorok");
    const objectId = new ObjectId(doctorId);

    // Ellenőrizzük, hogy létezik-e a doktor
    const doctor = await collection.findOne({ _id: objectId });
    if (!doctor) {
      console.log(`Doctor ${doctorId} not found in the database`);
      return res.status(404).send("Doctor not found");
    }

    if (req.body.name) {
      const { name } = req.body;
      console.log(
        `Attempting to update doctor with ID: ${doctorId} to name: ${name}`
      );

      const result = await collection.updateOne(
        { _id: objectId },
        { $set: { nev: name } }
      );

      // Ellenőrizzük az adatbázis frissítést
      const updatedDoctor = await collection.findOne({ _id: objectId });
      if (
        result.modifiedCount === 1 &&
        updatedDoctor &&
        updatedDoctor.nev === name
      ) {
        console.log(`Doctor ${doctorId} updated successfully`);
        return res.status(200).send("Doctor updated successfully");
      } else {
        console.log(`Doctor ${doctorId} not found after update attempt`);
        return res.status(404).send("Doctor not found after update");
      }
    } else {
      console.log("No name field provided");
      return res.status(400).send("No name field provided");
    }
  } catch (error) {
    console.error("Error updating doctor:", error);
    return res.status(500).send("Error updating doctor");
  }
});
app.put("/updateDoctorSpeciality/:id", async (req, res) => {
  const doctorId = req.params.id;

  console.log(`PUT request received for doctor with ID: ${doctorId}`);

  try {
    if (!ObjectId.isValid(doctorId)) {
      console.log("Invalid ID format");
      return res.status(400).send("Invalid ID format");
    }

    const collection = db.collection("Doktorok");
    const objectId = new ObjectId(doctorId);

    // Ellenőrizzük, hogy létezik-e a doktor
    const doctor = await collection.findOne({ _id: objectId });
    if (!doctor) {
      console.log(`Doctor ${doctorId} not found in the database`);
      return res.status(404).send("Doctor not found");
    }

    if (req.body.szak) {
      const { szak } = req.body;
      console.log(
        `Attempting to update doctor with ID: ${doctorId} to speciality: ${szak}`
      );

      const result = await collection.updateOne(
        { _id: objectId },
        { $set: { szak: szak } }
      );

      // Ellenőrizzük az adatbázis frissítést
      const updatedDoctor = await collection.findOne({ _id: objectId });
      if (
        result.modifiedCount === 1 &&
        updatedDoctor &&
        updatedDoctor.szak === szak
      ) {
        console.log(`Doctor ${doctorId} updated successfully`);
        return res.status(200).send("Doctor updated successfully");
      } else {
        console.log(`Doctor ${doctorId} not found after update attempt`);
        return res.status(404).send("Doctor not found after update");
      }
    } else {
      console.log("No speciality field provided");
      return res.status(400).send("No speciality field provided");
    }
  } catch (error) {
    console.error("Error updating doctor:", error);
    return res.status(500).send("Error updating doctor");
  }
});
app.post("/addPatient", async (req, res) => {
  const {
    name,
    kor,
    betegseg,
    felveteldatuma,
    kiengedesdatuma,
    aktiv,
    doctor,
  } = req.body;

  try {
    const result = await db.collection("Paciensek").insertOne({
      name,
      kor,
      betegseg,
      felveteldatuma,
      kiengedesdatuma,
      aktiv,
      doctor,
    });
    console.log("New patient added with ID:", result.insertedId);
    res.status(200).json({ _id: result.insertedId, ...req.body });
  } catch (error) {
    console.error("Error adding patient:", error);
    res.status(500).send("Error adding patient");
  }
});

app.get("/patients", async (req, res) => {
  console.log("Received GET request for /patients");
  try {
    console.log("Attempting to fetch patients from the database...");
    const patients = await db.collection("Paciensek").find({}).toArray();
    console.log("Successfully fetched patients:", patients);
    res.status(200).json(patients);
  } catch (error) {
    console.error("Error fetching patients:", error);
    res.status(500).send("Error fetching patients");
  }
  console.log("Finished processing GET request for /patients");
});
app.delete("/patients/:id", async (req, res) => {
  try {
    const patientId = req.params.id;
    if (!ObjectId.isValid(patientId)) {
      console.log("Invalid ID format:", patientId);
      return res.status(400).send("Invalid ID format");
    }

    const collection = db.collection("Paciensek");
    const objectId = new ObjectId(patientId);

    // Find the patient before deletion to get the doctor ID
    const patient = await collection.findOne({ _id: objectId });
    if (!patient) {
      console.log(`Patient with ID ${objectId} not found`);
      return res.status(404).send("Patient not found");
    }

    // Delete the patient
    const result = await collection.deleteOne({ _id: objectId });
    if (result.deletedCount === 1) {
      console.log(`Patient with ID ${objectId} deleted`);

      // Remove the patient ID from the doctor's patients array
      const doctorsCollection = db.collection("Doktorok");
      const doctorObjectId = new ObjectId(patient.doctor);
      const updateResult = await doctorsCollection.updateOne(
        { _id: doctorObjectId },
        { $pull: { patients: objectId } }
      );

      if (updateResult.modifiedCount === 1) {
        console.log(
          `Patient ID ${objectId} removed from doctor ${doctorObjectId}`
        );
        res.status(200).send("Patient deleted and removed from doctor");
      } else {
        console.log(
          `Failed to remove patient ID ${objectId} from doctor ${doctorObjectId}`
        );
        res.status(500).send("Patient deleted but failed to update doctor");
      }
    } else {
      console.log(`Patient with ID ${objectId} not found`);
      res.status(404).send("Patient not found");
    }
  } catch (error) {
    console.error("Error deleting patient:", error);
    res.status(500).send("Error deleting patient");
  }
});

app.get("/getDoctorById/:id", async (req, res) => {
  try {
    const doctorId = req.params.id;
    if (!ObjectId.isValid(doctorId)) {
      return res.status(400).send("Invalid ID format");
    }

    const collection = db.collection("Doktorok");
    const objectId = new ObjectId(doctorId);
    const doctor = await collection.findOne({ _id: objectId });

    if (doctor) {
      res.status(200).json(doctor);
    } else {
      res.status(404).send("Doctor not found");
    }
  } catch (error) {
    console.error("Error fetching doctor:", error);
    res.status(500).send("Error fetching doctor");
  }
});

app.post("/linkPatientToDoctor", async (req, res) => {
  const { doctorId, patientId } = req.body;

  try {
    if (!ObjectId.isValid(doctorId) || !ObjectId.isValid(patientId)) {
      return res.status(400).send("Invalid ID format");
    }

    const doctorObjectId = new ObjectId(doctorId);
    const patientObjectId = new ObjectId(patientId);

    const doctorsCollection = db.collection("Doktorok");
    const patientsCollection = db.collection("Paciensek");

    // Adding patient ID to doctor's patients array
    const updateDoctorResult = await doctorsCollection.updateOne(
      { _id: doctorObjectId },
      { $addToSet: { patients: patientObjectId } }
    );

    // Adding doctor ID to patient's doctor field
    const updatePatientResult = await patientsCollection.updateOne(
      { _id: patientObjectId },
      { $set: { doctor: doctorObjectId } }
    );

    if (
      updateDoctorResult.modifiedCount === 1 &&
      updatePatientResult.modifiedCount === 1
    ) {
      res.status(200).send("Patient linked to doctor successfully");
    } else {
      res.status(404).send("Doctor or patient not found");
    }
  } catch (error) {
    console.error("Error linking patient to doctor:", error);
    res.status(500).send("Error linking patient to doctor");
  }
});
// Szerver oldali kód
app.get("/patients/:id", async (req, res) => {
  try {
    const patientId = req.params.id;
    if (!ObjectId.isValid(patientId)) {
      return res.status(400).send("Invalid ID format");
    }

    const collection = db.collection("Paciensek");
    const objectId = new ObjectId(patientId);
    const patient = await collection.findOne({ _id: objectId });

    if (patient) {
      res.status(200).json(patient);
    } else {
      res.status(404).send("Patient not found");
    }
  } catch (error) {
    console.error("Error fetching patient:", error);
    res.status(500).send("Error fetching patient");
  }
});

app.put("/updatePatientName/:id", async (req, res) => {
  const patientId = req.params.id;
  const { name } = req.body;

  try {
    if (!ObjectId.isValid(patientId)) {
      return res.status(400).send("Invalid ID format");
    }

    const collection = db.collection("Paciensek");
    const objectId = new ObjectId(patientId);

    const result = await collection.updateOne(
      { _id: objectId },
      { $set: { name } }
    );

    if (result.modifiedCount === 1) {
      return res.status(200).send("Patient updated successfully");
    } else {
      return res.status(404).send("Patient not found after update attempt");
    }
  } catch (error) {
    console.error("Error updating patient:", error);
    return res.status(500).send("Error updating patient");
  }
});

app.put("/updatePatientStatus/:id", async (req, res) => {
  const { id } = req.params;
  const { aktiv, kiengedesdatuma } = req.body;

  try {
    // Itt végezzük a frissítést az adatbázisban
    const result = await db.collection("Paciensek").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: { aktiv, kiengedesdatuma },
      }
    );

    if (result.modifiedCount === 1) {
      res.status(200).send({ message: "Patient updated successfully" });
    } else {
      res.status(404).send({ message: "Patient not found" });
    }
  } catch (error) {
    console.error("Error updating patient:", error);
    res.status(500).send({ message: "Error updating patient" });
  }
});
