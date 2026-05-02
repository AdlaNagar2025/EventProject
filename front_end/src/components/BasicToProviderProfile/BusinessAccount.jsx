import React, { useEffect, useState } from "react";
import axios from "axios";
import classes from "./BusinessAccount.module.css";
import FormInput from "../BasicToProviderProfile/FormInput";
import ImageUpload from "../BasicToProviderProfile/ImagesCode/ImageUpload"; // וודאי שהנתיב הזה נכון אצלך

const initialChief = {
  specialty: "",
  phone: "",
  price_per_hour: "",
  start_year: "",
  description: "",
  capacity: "",
  city: "",
  street: "",
};

const initialHall = {
  hall_name: "",
  city: "",
  street: "",
  price: "",
  phone: "",
  capacity: "",
  email: "",
  description: "",
};

const CHIEF_FIELDS = [
  {
    label: "Specialty",
    name: "specialty",
    placeholder: "e.g. Italian",
    required: true,
  },
  {
    label: "Price/Hour",
    name: "price_per_hour",
    type: "number",
    required: true,
  },
  { label: "Start Year", name: "start_year", type: "number", required: false },
  { label: "Max Capacity", name: "capacity", type: "number", required: true },
  {
    label: "Phone",
    name: "phone",
    type: "tel",
    required: true,
    extraProps: { pattern: "^05\\d{8}$" },
  },
  { label: "City", name: "city", required: true },
  { label: "Street", name: "street", required: false },
];

const HALL_FIELDS = [
  { label: "Hall Name", name: "hall_name", required: true },
  { label: "Price", name: "price", type: "number", required: true },
  { label: "Email", name: "email", type: "email", required: true },
  {
    label: "Phone",
    name: "phone",
    type: "tel",
    required: true,
    extraProps: { pattern: "^05\\d{8}$" },
  },
  { label: "Capacity", name: "capacity", type: "number", required: true },
  { label: "City", name: "city", required: true },
  { label: "Street", name: "street", required: false },
];

export default function BusinessAccount({ user, isDisable }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [chiefData, setChiefData] = useState(initialChief);
  const [hallData, setHallData] = useState(initialHall);

  const isChief = user?.role === "Chief";
  const data = isChief ? chiefData : hallData;
  const relevantFields = isChief ? CHIEF_FIELDS : HALL_FIELDS;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (isChief) setChiefData((prev) => ({ ...prev, [name]: value }));
    else setHallData((prev) => ({ ...prev, [name]: value }));
  };

  const fetchProfile = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3030/provider/MyProfile",
        {
          withCredentials: true,
        },
      );
      if (response.data.success && response.data.data) {
        if (isChief) setChiefData(response.data.data);
        else setHallData(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error.message);
    }
  };

  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);

  const submitProfile = async (e) => {
    e.preventDefault();

    // בדיקות ולידציה
    if (data.description.length < 20) {
      return alert("Description too short (min 20 chars).");
    }
    if (
      isChief &&
      data.start_year &&
      data.start_year > new Date().getFullYear()
    ) {
      return alert("Year cannot be in the future.");
    }

    // בדיקת ערכים חיוביים
    if (isChief) {
      if (data.price_per_hour <= 0 || data.capacity <= 0) {
        return alert("Please enter valid positive values.");
      }
    } else {
      if (data.price <= 0 || data.capacity <= 0) {
        return alert("Please enter valid positive values.");
      }
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        "http://localhost:3030/provider/businessAccount",
        data,
        { withCredentials: true },
      );
      if (response.data.success) {
        alert("Saved successfully!");
        fetchProfile();
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return <div className={classes.loader}>Loading...</div>;

  const hasExistingData = isChief
    ? !!chiefData.specialty
    : !!hallData.hall_name;

  return (
    <div className={classes.container}>
      <h2>Business Profile Setup</h2>
      <p>Hello {user.first_name}, please update your business details</p>

      {/* העלאת תמונות - החלק שמוזג מה-Main */}
      <section className={classes.imageSection}>
        <ImageUpload user={user} />
      </section>

      <form className={classes.form} onSubmit={submitProfile}>
        <div className={classes.gridSection}>
          <h3>{isChief ? "Chief Details" : "Hall Details"}</h3>
          {relevantFields.map((field) => (
            <FormInput
              key={field.name}
              {...field}
              value={data[field.name] || ""}
              onChange={handleChange}
              disabled={isDisable}
            />
          ))}
        </div>

        <textarea
          placeholder="Detailed description of your services..."
          name="description"
          className={classes.textarea}
          value={data.description || ""}
          onChange={handleChange}
          minLength={20}
          required
          disabled={isDisable}
        />

        <button
          type="submit"
          className={classes.submitBtn}
          disabled={isSubmitting || isDisable}
        >
          {isSubmitting
            ? "Saving..."
            : hasExistingData
              ? "Update Details"
              : "Save & Submit"}
        </button>
      </form>
    </div>
  );
}
