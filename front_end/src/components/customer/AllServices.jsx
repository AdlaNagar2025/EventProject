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


    return(
        <div>
             <h1>aLL</h1>  
             <h2>{providers.length}</h2>      
             {providers.map(p =>(
                <div  key={p.id} >
                <BusinessProfile user={user} provider={p}/>
                </div>
            ))}
        </div>
    // <div>
    //     <h1>All Available Services</h1>
    //     <h2>Found {providers.length} providers</h2>
    //     <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
    //         {providers.map((p) => (
    //             <div key={p.id} style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '8px' }}>
    //                 <h3>{p.first_name}</h3>
    //                 <p>Type: {p.provider_type}</p>
    //                 <p>Email: {p.email}</p>
    //                 {/* כאן תוכלי בהמשך לשים את הקומפוננטה של BusinessProfile */}
    //             </div>
    //         ))}
    //     </div>
    // </div>
);

    
}











