import { useEffect, useState } from "react";
import classes from "./findavendor.module.css";
import BusinessProfile from "../CommonComponents/BusinessProfile";
import ServiceCard from "../BasicToProviderProfile/ServiceCard";
import axios from "axios";

export default function FindAVendor({ user }) {
  const [issearch, setIsSearch] = useState(false);
  const [dataToSearch, setDataToSearch] = useState({
    city: "",
    capacity: "",
    price: "",
  });

  const [resultSearching, setResultSearching] = useState([]);

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
          <ServiceCard user={user} provider={p} key={p.id} />
        ))}
      </div>

      <button onClick={() => setIsSearch(true)}>Search</button>
    </div>
  );
}
