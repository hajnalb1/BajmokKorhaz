import React from "react";
import "./Footer.css"; // Importáld a CSS fájlt

const Footer = () => {
  return (
    <div className="footer">
      <img src="/download.png" className="footer-image" />
      <div>
        <p>© 2024 Példa Kft. Minden jog fenntartva.</p>
        <p>Kapcsolat: info@pelda.hu</p>
      </div>{" "}
      <a
        href="https://maps.google.com/?q=korhaz"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src="/googlemaps.jpg" alt="Kórház Logo" className="footer-image" />
      </a>
    </div>
  );
};

export default Footer;
