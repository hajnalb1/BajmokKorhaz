import React, { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Dropdown from "../ui/Dropdown";
import { handleDoctorSubmit, handleSubmit } from "../appFunction/Functions";

export default function Doktor({ render, setRender }) {
  const [nev, setNev] = useState("");
  const [kor, setKor] = useState("");
  const [szak, setSzak] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <form
      onSubmit={(event) =>
        handleDoctorSubmit({
          event,
          nev,
          kor,
          szak,
          setIsSubmitting,
          setLoading,
          setError,
          setNev,
          setKor,
          setSzak,
          setRender,
          render,
        })
      }
    >
      <div className="input-container">
        {" "}
        <Input
          inputneve={"Doktor neve"}
          state={nev}
          setState={setNev}
          type={"text"}
          id={"nev"}
          className={"form-input"}
        />
        <Input
          inputneve={"Doktor kora"}
          state={kor}
          setState={setKor}
          type={"date"}
          id={"kor"}
          className={"form-input"}
        />
        <Input
          inputneve={"Szakterülete"}
          state={szak}
          setState={setSzak}
          type={"text"}
          id={"szak"}
          className={"form-input"}
        />{" "}
        <Button
          disabled={isSubmitting}
          className={"doktorButton"}
          type="submit" // Form submit eseményt kezel
          name={"Doktor mentése"}
        />
      </div>
      {(nev === "" || szak === "" || kor === "") && (
        <p style={{ textAlign: "center", marginTop: "2px" }}>
          Minden mező kitöltése kötelező
        </p>
      )}
    </form>
  );
}
