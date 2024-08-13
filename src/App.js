import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";
import Doktor from "./Doktor/Doktor";
import DoktorLista from "./Doktor/DoktorLista";
import Paciensekfelvetele from "./Beteg/Paciensekfelvetele";
import PaciensekLista from "./Beteg/PaciensekLista";
import "./App.css";

import Button from "./ui/Button";

function App() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mutasdaListat, setMutasdaListat] = useState(false);

  const [render, setRender] = useState(1);
  const showList = () => {
    setMutasdaListat(!mutasdaListat);
  };
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("http://localhost:5000/doctors");
        if (!response.ok) {
          throw new Error("Failed to fetch doctors");
        }
        const data = await response.json();
        setDoctors(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [render]);

  return (
    <Router>
      <Navbar />{" "}
      <div className="container">
        <Routes>
          <Route
            path="/doctors"
            element={
              <>
                <Doktor render={render} setRender={setRender} />
                <br />
                <div
                  id="ran"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: "8px",
                  }}
                >
                  <Button
                    className={"showDoktorButton"}
                    onClick={showList}
                    name={
                      mutasdaListat
                        ? "Rejtsd el a doktorokat"
                        : "Mutasd a doktorokat"
                    }
                  />
                </div>
                {mutasdaListat && (
                  <DoktorLista
                    render={render}
                    setRender={setRender}
                    setDoctors={setDoctors}
                    doctors={doctors}
                    setError={setError}
                    loading={loading}
                    error={error}
                  />
                )}
              </>
            }
          />
          <Route
            path="/patients"
            element={
              <>
                <Paciensekfelvetele
                  render={render}
                  setRender={setRender}
                  doctors={doctors}
                />
                <Button
                  className={"doktorButton"}
                  onClick={showList}
                  name={
                    mutasdaListat
                      ? "Rejtsd el a pacienseket"
                      : "Mutasd a pacienseket "
                  }
                />
                {mutasdaListat && (
                  <PaciensekLista render={render} setRender={setRender} />
                )}
              </>
            }
          />
          <Route />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
