import React, { useState , useEffect } from "react";
import BusinessAccount from "../Basic/BusinessAccount";
import ImageUpload from "../Basic/ImageUpload";
import Calendar from "../Basic/Calendar";
import classes from "./DetailsOFbusiness.module.css";
import axios from "axios";

function DetailsOFbusiness({ user }) {
  const [isDisable, setIsDisable] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("");

  useEffect(() => {
    const getStatus = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3030/provider/MyBusinessStatus",
          { withCredentials: true }
        );
        
        if (response.data.success) {
          const status = response.data.status;
          setCurrentStatus(status);
          // אם הסטטוס הוא PENDING או APPROVED - ננעל את האפשרות לערוך/לשלוח שוב
          if (status === "PENDING") {
            setIsDisable(true);
          }
        }
      } catch (error) {
        console.error("Failed to fetch status");
      }
    };
    getStatus();
  }, []);

console.log(user)
async function handleStatusChange() {
    try {
      const tableName = user.role=== "Chief" ? "chiefs" : "halls";
      const id=user.id
      const newStatus="PENDING"
      const response = await axios.post(
        "http://localhost:3030/provider/approve-business",
        { type: tableName, id, newStatus },
        { withCredentials: true },
      );
      // if (response.data.success) {
      //  //TGEEER STATUS IN TABLE DISABLE
      // }
      alert(response.data.message);
      setIsDisable(true)
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }
  return (
    <div className={`${classes.mainContainer} ${isDisable ? classes.disabledArea : ""}`}>
      <header className={classes.header}>
        <h1>Business Setup</h1>
        <p>Status: <strong>{currentStatus || "NOT SUBMITTED"}</strong></p>
      </header>

      {/* העברת isDisable לקומפוננטות הילד כדי שגם הן יינעלו */}
      <section className={classes.stepCard}>
        <div className={classes.stepNumber}>1</div>
        <BusinessAccount user={user} isDisable={isDisable} />
      </section>

      <div className={classes.divider} />

      <section className={classes.stepCard}>
        <div className={classes.stepNumber}>2</div>
        <ImageUpload role={user.role} user={user} isDisable={isDisable} />
      </section>

      <div className={classes.divider} />

      <section className={classes.stepCard}>
        <div className={classes.stepNumber}>3</div>
        <Calendar role={user.role} user={user} isDisable={isDisable} />
      </section>

      <button 
        onClick={handleStatusChange} 
        disabled={isDisable} // תיקון: disabled ולא disable
        className={classes.submitBtn}
      >
        {isDisable ? "Waiting for Approval..." : "Submit To Admin"}
      </button>
    </div>
  );
}

export default DetailsOFbusiness;
