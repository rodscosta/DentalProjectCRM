import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

export const AppointmentsContext = createContext(null);

const AppointmentsProvider = (props) => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = () => {
    axios
      .get("/appointments")
      .then((response) => setAppointments(response.data))
      .catch((err) => alert(err));
  };

  return (
    <AppointmentsContext.Provider value={{ appointments, setAppointments }}>
      {props.children}
    </AppointmentsContext.Provider>
  );
};

export default AppointmentsProvider;
