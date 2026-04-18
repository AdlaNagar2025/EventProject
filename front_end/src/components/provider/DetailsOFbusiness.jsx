import React from "react";
import BusinessAccount from "./BusinessAccount";
import ImageUpload from "./ImageUpload";
import Calendar from "./Calendar";
import classes from "./DetailsOFbusiness.module.css";
import axios from "axios";

function DetailsOFbusiness({ user }) {
  console.log(user)
async function handleStatusChange() {
    try {
      const tableName = user.role= "Chief" ? "chiefs" : "halls";
      const id=user.id
      const newStatus="PENDING"
      const response = await axios.post(
        "http://localhost:3030/admin/approve-business",
        { type: tableName, id, newStatus },
        { withCredentials: true },
      );
      // if (response.data.success) {
      //  //TGEEER STATUS IN TABLE DISABLE
      // }
      alert(response.data.message);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }
  return (
    <div className={classes.mainContainer}>
      <header className={classes.header}>
        <h1>Business Setup</h1>
        <p>Follow the steps below to prepare your profile for customers</p>

      </header>

      {/* שלב 1: פרטי עסק */}
      <section className={classes.stepCard}>
        <div className={classes.stepNumber}>1</div>
        <BusinessAccount user={user} />
      </section>

      <div className={classes.divider} />

      {/* שלב 2: גלריה */}
      <section className={classes.stepCard}>
        <div className={classes.stepNumber}>2</div>
        <ImageUpload user={user} />
      </section>

      <div className={classes.divider} />

      {/* שלב 3: ניהול זמינות */}
      <section className={classes.stepCard}>
        <div className={classes.stepNumber}>3</div>
        <Calendar user={user} />
      </section>

           <button onClick={handleStatusChange}>Submit To Admin </button>

    </div>
  );
}

export default DetailsOFbusiness;
