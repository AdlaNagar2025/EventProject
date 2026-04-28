
import { useEffect, useState } from "react"
import classes from "./findavendor.module.css"
import BusinessProfile from "../CommonComponents/BusinessProfile";
import axios from "axios";

export default function FindAVendor({user}) {
    const [issearch,setIsSearch]=useState(false)
    const [dataToSearch,setDataToSearch]=useState(
        {city:"" , capacity:"" , price:""    })

    const [resultSearching,setResultSearching]=useState([])
    const [providers,setProviders]=useState([])


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDataToSearch((prev) => ({ ...prev, [name]: value }));
        console.log(dataToSearch)
    };

    // useEffect(()=>{
    //     if (!dataToSearch.city) return; 
    //     const fetchAllResult=async()=>{
    //          try{

        
    //         const response=await axios.post("http://localhost:3030/customer/Searching" ,dataToSearch,{withCredentials:true})
    //         console.log(response.data.data)
    //         setResultSearching(response.data.data);
    //         if(resultSearching.length > 0 )
    //         {
    //             const rolePath=user.role.toLowerCase();
    //      resultSearching.map(async(r)=>{
    //               const url=`http://localhost:3030/${rolePath}/Profile/${r.id}`

    //     const response = await axios.get( url,{ withCredentials: true, }, );
    //     setProviders([...prev],response.data.data)

    //     })
  
        
    //         }
    //     } catch (error) {
    //         console.error("Search failed", error);
    //     }
    //     finally{
    //         // setIsSearch(false)

    //     }
    // }
    
    


    // if(issearch)
    
    //     fetchAllResult()
    
    


    // },[issearch])

//     useEffect(() => {
//     if (!issearch || !dataToSearch.city) {
//         setIsSearch(false);
//         return;
//     }

//     const fetchAllResult = async () => {
//         try {
//             // 1. קבלת רשימת ה-ID מהחיפוש
//             const response = await axios.post("http://localhost:3030/customer/Searching", dataToSearch, { withCredentials: true });
//             const searchData = response.data.data; // משתמשים במשתנה מקומי ולא ב-State
// console.log(searchData)
//             if (searchData && searchData.length > 0) {
//                 const rolePath = user?.role.toLowerCase();

//                 // 2. יצירת רשימה של קריאות לשרת (Promises)
//                 const profilePromises = searchData.map(r => 
//                     axios.get(`http://localhost:3030/${rolePath}/Profile/${r.id}`, { withCredentials: true })
//                 );
//                 console.log("done")
//                 console.log(profilePromises)
// 1
//                 // 3. הרצה של כל הקריאות במקביל (הרבה יותר מהיר!)
//                 const profilesResponses = await Promise.all(profilePromises);
                
//                 // 4. חילוץ הנתונים ועדכון ה-State פעם אחת בסוף
//                 const allProfiles = profilesResponses.map(res => res.data.data);
//                 setProviders(allProfiles);
//             } else {
//                 setProviders([]); // אם אין תוצאות, מנקים את הרשימה
//             }
//         } catch (error) {
//             console.error("Search failed", error);
//         } finally {
//             setIsSearch(false); // חשוב מאוד כדי שנוכל ללחוץ שוב על חיפוש
//         }
//     };

//     fetchAllResult();
// }, [issearch]);



 


    return(
        <div>
            <p>Find Your Event Team:Unified Vendor Search</p> 
            <div className={classes.search}>
                <label>Location: </label>
                <input type="text" value={dataToSearch.city} name="city" onChange={handleInputChange}/>
                  <label>capacity: </label>
                <input type="number" value={dataToSearch.capacity} name="capacity" onChange={handleInputChange}/>
                  <label>price: </label>
                <input type="number" value={dataToSearch.price} name="price" onChange={handleInputChange}/>

            </div>
            <div className={classes.result}>
            {providers.map((p)=>(
                <div key={p.id}>
                  <BusinessProfile user={user} provider={p} />
                  </div>
                )) }

            </div>


            <button onClick={()=>setIsSearch(true)}>Search</button>
        </div>
    )
}