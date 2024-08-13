import React, { useState } from "react";

export default function Dropdown({
  name,
  options,
  ezTörténikHaKattintaszValamire,
  dropDownBodyStyle,
}) {
  const [showOptions, setShowOptions] = useState(false);

  const show = () => setShowOptions(!showOptions);

  return (
    <>
      <div onClick={show}>
        <p
          style={{
            cursor: "pointer",
          }}
        >
          {name}
        </p>
      </div>
      {showOptions && (
        <div className={dropDownBodyStyle}>
          {options.map((option, index) => (
            <span
              style={{
                cursor: "pointer",
              }}
              key={index}
              onClick={() => {
                ezTörténikHaKattintaszValamire(option.value);
                show();
              }}
            >
              {option.label}
            </span>
          ))}
        </div>
      )}
    </>
  );
}
