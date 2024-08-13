import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import Button from "../ui/Button";
import Dropdown from "../ui/Dropdown";

const Navbar = () => {
  const [language, setLanguage] = useState("HU-hu"); // Kezdeti nyelv
  const [translations, setTranslations] = useState({}); // Fordítások tárolása

  useEffect(() => {
    import(`../lg/${language}.json`)
      .then((module) => {
        setTranslations(module.default);
      })
      .catch((error) => console.error("Failed to load language file: ", error));
  }, [language]);

  const nyelvValtas = (newLanguage) => {
    setLanguage(newLanguage);
  };

  return (
    <div className="navbar">
      <div className="logo">{translations.hospital_name}</div>
      <div className="nav-Links">
        <Link to="/doctors">{translations.doktors_link}</Link>
        <Link to="/patients">{translations.patients_link}</Link>
        <a
          href="https://bolnicasubotica.com/index.php"
          target="_blank"
          rel="noopener noreferrer"
        >
          {translations.hospital_site}
        </a>
      </div>
      <div
        id="2button"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
          height: "100%",
        }}
      >
        <Button className="auth-buttons" name={translations.button_login} />

        <Button
          className="auth-buttons"
          name={translations.button_registration}
        />
      </div>

      <Dropdown
        name={"Nyelv"}
        options={[
          { label: "Magyar", value: "HU-hu" },
          { label: "Szerb", value: "SR-sr" },
          { label: "Angol", value: "ENG-eng" },
        ]}
        ezTörténikHaKattintaszValamire={nyelvValtas}
        dropDownBodyStyle={"languageDropDownBodyStyle"}
      />
    </div>
  );
};

export default Navbar;
