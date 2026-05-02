import classes from "./allServices.module.css"
import axios from "axios";
import { useEffect, useState } from "react";
import BusinessProfile from "../CommonComponents/BusinessProfile";


export default function AllServices({user}) {
    console.log("I am in Component")
    const [providers,setProviders]=useState([])

    useEffect(()=>{
    const fetchAllServices=async()=>{
        try{
          const response = await axios.get("http://localhost:3030/customer/AllServices", { withCredentials: true });
        if (response.data.success) {
          setProviders(response.data.data);
        }

    } catch (error) {
        console.error("Fetch failed:", error.message);
    }
        }
     
        fetchAllServices()

    },[])
return (
    <div className={classes.servicesContainer}>
      <h1 className={classes.title}>Our Wedding Services</h1>
      
      <div className={classes.countBadge}>
        Found {providers.length} matching services
      </div>

      <div className={classes.grid}>
        {providers.map((p) => (
          <div key={p.id} className={classes.profileWrapper}>
            {/* כאן אנחנו קוראים לפרופיל שבנינו קודם */}
            <BusinessProfile user={user} provider={p} />
          </div>
        ))}
      </div>
    </div>
  );
}









