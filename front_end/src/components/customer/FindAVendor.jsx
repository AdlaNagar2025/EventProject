import { useEffect, useState } from "react";
import classes from "./findavendor.module.css";
import ServiceCard from "../BasicToProviderProfile/ServiceCard";
import axios from "axios";

export default function FindAVendor({ user }) {
  const [issearch, setIsSearch] = useState(false);
  const [dataToSearch, setDataToSearch] = useState({
    city: "",
    capacity: "",
    price: "",
    date: "",
    startTime: "",
    endTime: "",
  });

  const [resultSearching, setResultSearching] = useState([]);
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    const fetchAllServices = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3030/customer/AllServices",
          { withCredentials: true },
        );
        if (response.data.success) {
          setProviders(response.data.data);
        }
      } catch (error) {
        console.error("Fetch failed:", error.message);
      }
    };

    fetchAllServices();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDataToSearch((prev) => ({ ...prev, [name]: value }));
    console.log(dataToSearch);
  };

  useEffect(() => {
    if (!dataToSearch.city) return;
    const fetchSearching = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3030/customer/Searching",
          dataToSearch,
          { withCredentials: true },
        );
        console.log(response.data.data);
        setResultSearching(response.data.data);
      } catch (error) {
        console.error("Search failed", error);
      } finally {
        setIsSearch(false);
      }
    };
    fetchSearching();
  }, [issearch]);

  return (
    <div>
      <p>Find Your Event Team:Unified Vendor Search</p>
      <div className={classes.search}>
        <label>Date:</label>
        <input
          type="date"
          min={new Date().toISOString().split("T")[0]}
          value={dataToSearch.date}
          name="date"
          onChange={handleInputChange}
        />
        <label>Start Time:</label>
        <input
          type="time"
          value={dataToSearch.startTime}
          name="startTime"
          onChange={handleInputChange}
        />
        <label>End Time:</label>
        <input
          type="time"
          value={dataToSearch.endTime}
          name="endTime"
          onChange={handleInputChange}
        />

        <label>Location: </label>
        <input
          type="text"
          value={dataToSearch.city}
          name="city"
          onChange={handleInputChange}
        />
        <label>capacity: </label>
        <input
          type="number"
          value={dataToSearch.capacity}
          name="capacity"
          onChange={handleInputChange}
        />
        <label>price: </label>
        <input
          type="number"
          value={dataToSearch.price}
          name="price"
          onChange={handleInputChange}
        />
      </div>
      <div className={classes.result}>
        {resultSearching.map((p) => (
          <ServiceCard user={user} provider={p} key={p.id} data={dataToSearch} />
        ))}
      </div>

      {resultSearching.length === 0 && (
        <div className={classes.providersGrid}>
          {providers.map((p) => (
            <div key={p.id} className={classes.cardContainer}>
              <ServiceCard user={user} provider={p} data={dataToSearch} />
              {/* <button>Select </button> */}
            </div>
          ))}
        </div>
      )}

      <button onClick={() => setIsSearch(true)}>Search</button>
    </div>
  );
}
