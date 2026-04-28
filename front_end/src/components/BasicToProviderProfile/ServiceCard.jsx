import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BusinessProfile from "../CommonComponents/BusinessProfile";
import classes from "./serviceCard.module.css";

export default function ServiceCard({ user, provider }) {
  const navigate = useNavigate();
  const [click, setClick] = useState(false);

  if (click) {
    return (
      <div>
        <button onClick={()=>setClick(false)} >Go Back</button>
        <BusinessProfile user={user} provider={provider} />
      </div>
    );
  }

  return (
    <div>
      <div className={classes.card}>
        <p>{provider.first_name}</p>
        <button onClick={() => setClick(true)}>View Details</button>
        <button>Select</button>
      </div>
    </div>
  );
}
