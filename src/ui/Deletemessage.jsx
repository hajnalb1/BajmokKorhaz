import React from "react";
import Button from "./Button";

export default function Deletemessage({ setState, del, id }) {
  console.log("Deletemessage component rendered");

  return (
    <div>
      <p>Biztos törölni akarja?</p>
      <Button
        onClick={() => {
          console.log(`Deleting patient with ID: ${id}`);
          del(id);
          console.log(`Called del function with ID: ${id}`);
          setState(false);
        }}
        name={"Igen"}
      />
      <Button
        onClick={() => {
          console.log("Cancel delete");
          setState(false);
        }}
        name={"Nem"}
      />
    </div>
  );
}
