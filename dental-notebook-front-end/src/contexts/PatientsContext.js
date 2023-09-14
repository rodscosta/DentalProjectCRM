import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

export const PatientsContext = createContext(null);

const PatientsProvider = (props) => {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = () => {
    axios
      .get("/patients")
      .then((response) => setPatients(response.data))
      .catch((err) => alert(err));
  };

  // console.log(patients);

  return (
    <PatientsContext.Provider value={{ patients, setPatients }}>
      {props.children}
    </PatientsContext.Provider>
  );
};

export default PatientsProvider;
