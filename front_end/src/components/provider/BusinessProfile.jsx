import React from 'react'
import axios from 'axios'
import { useState } from 'react'
import { useEffect } from 'react';
import classes from "./BusinessAccount.module.css"; // בואי נוסיף עיצוב בהמשך

export default function BusinessProfile({provider}) {
  const [chiefData, setChiefData] = useState({
    specialty: "",
    price_per_hour: "",
    experience_years: "",
    description: "",
    capacity: "",
    city: "",
    street: "",
  });
  const [hallData, setHallData] = useState({
    hall_name: "",
    city: "",
    street: "",
    price: "",
    phone: "",
    capacity: "",
    email: "",
    description: "",
  });

  useEffect(() => {
    const fechProfile = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3030/admin/Profile/${provider.id}`,
          {
            withCredentials: true,
          },
        );
        const data = response.data.data;
        console.log(response.data.data);
        if (provider.provider_type === "Chief") {
          setChiefData({
            specialty: data.specialty || "",
            price_per_hour: data.price_per_hour || "",
            experience_years: data.experience_years || "",
            description: data.description || "",
            capacity: data.capacity || "",
            city: data.city || "",
            street: data.street || "",
          });
        } else if (provider.provider_type === "Hall_Owner") {
          setHallData({
            hall_name: data.hall_name,
            city: data.city,
            street: data.street,
            price: data.price,
            phone: data.phone,
            capacity: data.capacity,
            email: data.email,
            description: data.description,
          });
        }
        console.log(chiefData)

      } catch (error) {
        console.log(error);
      }
    };
    fechProfile();
  }, []);

  return (
    <div className={classes.container}>
      <h2>Business Profile - {provider.first_name}</h2>

      {provider.provider_type === "Chief" && (
        <div className={classes.section}>
          <h3>Chief Professional Details</h3>
          <div className={classes.formGroup}>
            <label>Specialty:</label>
            <input type="text" value={chiefData.specialty} readOnly />

            <label>Price per Hour:</label>
            <input type="number" value={chiefData.price_per_hour} readOnly />

            <label>Experience:</label>
            <input type="number" value={chiefData.experience_years} readOnly />

            <label>City:</label>
            <input type="text" value={chiefData.city} readOnly />
          </div>
        </div>
      )}

      {provider.provider_type === "Hall_Owner" && (
        <div className={classes.section}>
          <h3>Hall Information</h3>
          <div className={classes.formGroup}>
            <label>Hall Name:</label>
            <input type="text" value={hallData.hall_name} readOnly />

            <label>Price:</label>
            <input type="number" value={hallData.price} readOnly />

            <label>Email:</label>
            <input type="email" value={hallData.email} readOnly />

            <label>City:</label>
            <input type="text" value={hallData.city} readOnly />
          </div>
        </div>
      )}
    </div>
  );
}