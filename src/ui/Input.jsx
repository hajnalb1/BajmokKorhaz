import React from "react";

const Input = ({ inputneve, state, setState, type, id }) => {
  const handleChange = (event) => {
    setState(event.target.value);
  };

  return (
    <div>
      <input
        className="styled-input"
        placeholder={inputneve}
        type={type}
        id={id}
        value={state}
        onChange={handleChange}
      />
    </div>
  );
};

export default Input;
