import React, { useEffect, useState } from "react";
import axios from "axios";
import classes from "./BusinessAccount.module.css";
import FormInput from "./FormInput";

const initialChief = {
  specialty: "",
  phone: "",
  price_per_hour: "",
  experience_years: "",
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
  {
    label: "Experience (Years)",
    name: "experience_years",
    type: "number",
    required: false,
  },
  { label: "Max Capacity", name: "capacity", type: "number", required: true },
  {
    label: "Phone",
    name: "phone",
    type: "tel",
    extraProps: { pattern: "^05\\d{8}$" },
    required: false,
  },
  { label: "City", name: "city", required: true },
  { label: "Street", name: "street", required: false },
];

const HALL_FIELDS = [
  { label: "Hall Name", name: "hall_name" },
  { label: "Price", name: "price", type: "number" },
  { label: "Email", name: "email", type: "email" },
  {
    label: "Phone",
    name: "phone",
    type: "tel",
    extraProps: { pattern: "^05\\d{8}$" },
  },
  { label: "Capacity", name: "capacity", type: "number" },
  { label: "City", name: "city" },
  { label: "Street", name: "street" },
];

export default function BusinessAccount({ user, isDisable }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [chiefData, setChiefData] = useState(initialChief);
  const [hallData, setHallData] = useState(initialHall);

  // בחירת הנתונים הנכונים לפי התפקיד
  const isChief = user?.role === "Chief";
  const data = isChief ? chiefData : hallData;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (user?.role === "Chief") {
      setChiefData((prev) => ({ ...prev, [name]: value }));
    } else if (user?.role === "Hall_Owner") {
      setHallData((prev) => ({ ...prev, [name]: value }));
    }
  };

  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);

  const submitProfile = async (e) => {
    e.preventDefault();
    const currentData = user?.role === "Chief" ? chiefData : hallData;
    if (currentData.description.length < 20) {
      return alert(
        "Please provide a more detailed description (at least 20 characters).",
      );
    }
    if (user?.role === "Chief") {
      const { price_per_hour, experience_years, capacity } = chiefData;
      if (price_per_hour <= 0 || experience_years < 0 || capacity <= 0) {
        return alert(
          "Please enter valid positive values for price, experience, and capacity.",
        );
      }
    } else if (user?.role === "Hall_Owner") {
      const { price, capacity } = hallData;
      if (price <= 0 || capacity <= 0) {
        return alert(
          "Please enter valid positive values for price and capacity.",
        );
      }
    }
    setIsSubmitting(true);
    try {
      const dataToSend = user?.role === "Chief" ? chiefData : hallData;
      const response = await axios.post(
        "http://localhost:3030/provider/businessAccount",
        data,
        { withCredentials: true },
      );
      if (response.data.success) {
        alert("Success!");
        fetchProfile();
      }
    } catch (error) {
      alert("Failed to save.");
    } finally {
      setIsSubmitting(false);
    }
  };
 const fetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost:3030/provider/MyProfile", {
          withCredentials: true,
        });

        if (response.data.success && response.data.data) {
          const dbData = response.data.data;
          if (user?.role === "Chief") {
            setChiefData({
              specialty: dbData.specialty || "",
              phone: dbData.phone || "",
              price_per_hour: dbData.price_per_hour || "",
              experience_years: dbData.experience_years || "",
              description: dbData.description || "",
              capacity: dbData.capacity || "",
              city: dbData.city || "",
              street: dbData.street || "",
            });
          } else if (user?.role === "Hall_Owner") {
            setHallData({
              hall_name: dbData.hall_name || "",
              city: dbData.city || "",
              street: dbData.street || "",
              price: dbData.price || "",
              phone: dbData.phone || "",
              capacity: dbData.capacity || "",
              email: dbData.email || "",
              description: dbData.description || "",
            });
          }
              }
      } catch (error) {
        console.error("Failed to fetch profile:", error.message);
      }
    }

  // ה-useEffect חייב להיות כאן, לפני כל return
  useEffect(() => {
    // אנחנו עוצרים את הפונקציה בפנים אם אין יוזר, במקום לעצור את כל ה-Hook
    if (!user) return; 
    fetchProfile();
  }, [user]); // הוספנו את user כתלות

  // רק כאן, אחרי כל ה-Hooks, מותר לעשות return מוקדם
  if (!user) {
    return <p>Loading...</p>;
  }

  // שאר הלוגיקה (handleChange, submitProfile...)
  const hasExistingData = user?.role === "Chief" 
    ? chiefData.specialty !== "" 
    : hallData.hall_name !== "";

  const relevantFields = isChief ? CHIEF_FIELDS : HALL_FIELDS;

  return (
    <div className={classes.container}>
      <h2>Business Profile Setup</h2>
      <p>Hello {user?.first_name}, please complete your business details</p>

      <form className={classes.form} onSubmit={submitProfile}>
        {user?.role === "Chief" && (
          <div className={classes.section}>
            <h3>Chief Professional Details</h3>
            <input
              type="text"
              placeholder="Specialty (e.g. Italian)"
              name="specialty"
              required
              value={chiefData.specialty}
              onChange={handleChange}
            />
            <input
              type="number"
              placeholder="Price per hour"
              name="price_per_hour"
              required
              value={chiefData.price_per_hour}
              onChange={handleChange}
            />
            <input
              type="number"
              placeholder="Years of experience"
              name="experience_years"
              value={chiefData.experience_years}
              onChange={handleChange}
            />
            <input
              type="number"
              placeholder="Max Guests Capacity"
              name="capacity"
              required
              value={chiefData.capacity}
              onChange={handleChange}
            />
            <input
              type="text"
              placeholder="City"
              name="city"
              required
              value={chiefData.city}
              onChange={handleChange}
            />
            <input
              type="text"
              placeholder="Street"
              name="street"
              value={chiefData.street}
              onChange={handleChange}
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone (e.g. 0501234567)"
              pattern="^05\d{8}$"
              value={chiefData.phone}
              onChange={handleChange}
            />
          </div>
        )}

        {user?.role === "Hall_Owner" && (
          <div className={classes.section}>
            <h3>Hall Information</h3>
            <input
              type="text"
              placeholder="Hall Name"
              name="hall_name"
              required
              value={hallData.hall_name}
              onChange={handleChange}
            />
          ))}
        </div>

        <textarea
          placeholder="Detailed description of your services..."
          name="description"
          className={classes.textarea}
          value={
            user?.role === "Chief" ? chiefData.description : hallData.description
          }
          onChange={handleChange}
          minLength={20}
          required
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
