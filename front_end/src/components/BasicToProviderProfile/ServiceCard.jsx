import React, { useState } from "react";
import BusinessProfile from "../CommonComponents/BusinessProfile";
import { useNavigate } from "react-router-dom";
import classes from "./serviceCard.module.css";

export default function ServiceCard({ user, provider, data }) {
  const [click, setClick] = useState(false);
  const navigate = useNavigate();

  if (click) {
    return (
      <div>
        <button onClick={() => setClick(false)}>Go Back</button>
        <BusinessProfile user={user} provider={provider} />
      </div>
    );
  }

  function moveToEventDetails() {
    navigate("/bookEvent", {
      state: {
        dataToEvent: data,
      },
    });
  }

  return (
    <div>
      <div className={classes.card}>
        <p>{provider.first_name}</p>
        <button onClick={() => setClick(true)}>View Details</button>
        <button onClick={moveToEventDetails}>Select</button>
      </div>
    </div>
  );
}
