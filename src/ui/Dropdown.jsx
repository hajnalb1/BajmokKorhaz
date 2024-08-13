import React, { useState } from "react";

export default function Dropdown({
  name,
  options,
  ezTörténikHaKattintaszValamire,
  dropDownBodyStyle,
  dropDownTextSize,
}) {
  const [showOptions, setShowOptions] = useState(false);

  const show = () => setShowOptions(!showOptions);

  return (
    <>
      <span onClick={show}>
        <span
          style={{
            cursor: "pointer",
          }}
        >
          {name}
        </span>
      </span>
      {showOptions && (
        <div className={dropDownBodyStyle}>
          {options.map((option, index) => (
            <span
              className={dropDownTextSize}
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
