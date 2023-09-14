import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

export const TreatmentsContext = createContext(null);

const TreatmentsProvider = (props) => {
  const [treatments, setTreatments] = useState([]);
  const [isAddNewTreatmentShown, setIsAddNewTreatmentShown] = useState(false);

  const [newTreatment, setNewTreatment] = useState({
    name: "",
    price: "",
  });

  const fetchTreatments = () => {
    axios
      .get("/treatments")
      .then((response) => setTreatments(response.data))
      .catch((error) => console.log(error));
  };
  useEffect(() => {
    fetchTreatments();
  }, []);

  /* ==============DELETE TREATMENT=============== */
  const handleDelete = (treatmentId) => {
    const deleteConfirmation = window.confirm(
      "Are you sure you want to delete this treatment?"
    );

    if (deleteConfirmation) {
      axios
        .delete(`/treatments/${treatmentId}`)
        .then((response) => {
          console.log(response.data);
          const filteredTreatments = treatments.filter(
            (treatment) => treatment.id !== treatmentId
          );
          setTreatments(filteredTreatments);
        })
        .catch((error) => alert(error));
    }
  };

  /* ==============ADD TREATMENT=============== */
  const handleAddNewTreatment = (event) => {
    const { name, value } = event.target;
    setNewTreatment({ ...newTreatment, [name]: value });
  };

  const handleSubmitNewTreatment = (event) => {
    event.preventDefault();
    axios
      .post(`/treatments`, newTreatment)
      .then((response) => {
        setTreatments([...treatments, response.data]);
        setIsAddNewTreatmentShown(false);
        setNewTreatment({
          name: "",
          price: "",
        });
      })
      .catch((error) => alert(error));
  };

  return (
    <TreatmentsContext.Provider
      value={{
        handleDelete,
        handleAddNewTreatment,
        handleSubmitNewTreatment,
        treatments,
        setTreatments,
        newTreatment,
        setNewTreatment,
        isAddNewTreatmentShown,
        setIsAddNewTreatmentShown,
      }}
    >
      {props.children}
    </TreatmentsContext.Provider>
  );
};

export default TreatmentsProvider;
