import React from "react";

export default function Button({ className, onClick, name, disabled }) {
  const handleClick = (event) => {
    console.log(`Button ${name} clicked`);
    if (onClick && typeof onClick === "function") {
      onClick(event); // Az esemény paraméter átadása
    } else {
      console.error("onClick is not a function");
    }
  };

  return (
    <button className={className} onClick={handleClick} disabled={disabled}>
      {name}
    </button>
  );
}
