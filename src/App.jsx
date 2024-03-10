import React, { useState, useEffect } from "react";
import axios from "axios";
import "./index.css";

const API_BASE_URL = "https://restcountries.com/v3.1/name/";

const CountryCard = ({ country }) => {
  const { name, area, region, flags, currencies, languages } = country;

  return (
    <div className="country-card">
      <h2 className="text-2xl font-semibold my-4">{name.common}</h2>
      <p>Area: {area} sq km</p>
      <p>Continent: {region}</p>
      <img src={flags.png} alt={`Flag of ${name.common}`} />
      <p>
        Currencies:{" "}
        {currencies &&
          Object.entries(currencies)
            .map(([code, currency]) => `${currency.name} (${currency.symbol})`)
            .join(", ")}
      </p>
      <p>Languages: {languages && Object.values(languages).join(", ")}</p>
    </div>
  );
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (searchTerm.trim() !== "") {
          const response = await axios.get(`${API_BASE_URL}${searchTerm}`);
          setSearchResults(response.data);
          setError(null);
        } else {
          // If the search term is empty, clear the results
          setSearchResults([]);
          setError(null);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error);
      }
    };

    // Debounce function to delay API calls
    const debouncedFetchData = debounce(fetchData, 500);
    debouncedFetchData();
  }, [searchTerm]);

  // Debounce utility function
  const debounce = (func, delay) => {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  };

  return (
    <div className="app">
      <input
        type="text"
        placeholder="Search country..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {searchResults.length === 0 && searchTerm.trim() !== "" && (
        <p className="text-red-500">
          {error
            ? `Error fetching data: ${error.message}`
            : "No matches found for the given search term."}
        </p>
      )}
      {searchResults.length === 0 && searchTerm.trim() === "" && (
        <p className="font-bold">Start typing to search...</p>
      )}
      <div className="country-list">
        {searchResults.map((country) => (
          <CountryCard key={country.cca3} country={country} />
        ))}
      </div>
    </div>
  );
};

export default App;
