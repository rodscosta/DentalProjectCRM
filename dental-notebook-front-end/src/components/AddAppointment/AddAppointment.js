import React, { useState, useContext } from "react";
import axios from "axios";
import moment from "moment";
import { TreatmentsContext } from "../../contexts/TreatmentsContext";
import { AppointmentsContext } from "../../contexts/AppointmentsContext";
import { PatientsContext } from "../../contexts/PatientsContext";
import DeleteCircle from "../../assets/DeleteCircle.svg";
import "./AddAppointment.css";
const AddAppointment = ({ setIsAddNewAppointmentShown }) => {
  const [newAppointment, setNewAppointment] = useState({
    patient_id: 0,
    appointment_treatments: [],
    appointment_date: "",
  });

  const { treatments } = useContext(TreatmentsContext);
  const { appointments, setAppointments } = useContext(AppointmentsContext);
  const { patients } = useContext(PatientsContext);

  const handleAddNewAppointment = (event) => {
    const { name, value } = event.target;

    setNewAppointment({ ...newAppointment, [name]: value });
  };

  const handleSubmitAddAppointment = (event) => {
    event.preventDefault();

    newAppointment.appointment_date = moment
      .utc(newAppointment.appointment_date)
      .format("YYYY-MM-DD HH:mm:ss");

    axios
      .post(`/appointments`, newAppointment)
      .then((response) => {
        setAppointments([...appointments, response.data]);
        setIsAddNewAppointmentShown(false);
      })
      .catch((error) => alert(error));

    setNewAppointment({
      patient_id: 0,
      appointment_treatments: [],
      appointment_date: "",
    });
  };

  const handleAddTreatmentToAppointment = (event) => {
    const treatmentNotInAppointments =
      !newAppointment.appointment_treatments.find(
        (item) => item.treatment_id === Number(event.target.value)
      );

    if (event.target.value !== "" && treatmentNotInAppointments) {
      const treatmentToAdd = treatments.find(
        (treatment) => treatment.id === Number(event.target.value)
      );

      setNewAppointment({
        ...newAppointment,
        appointment_treatments: [
          ...newAppointment.appointment_treatments,
          {
            treatment_id: treatmentToAdd.id,
            treatment_price: treatmentToAdd.price,
          },
        ],
      });
    }
  };

  const handleCancel = () => {
    setIsAddNewAppointmentShown(false);

    setNewAppointment({
      patient_id: 0,
      appointment_treatments: [],
      appointment_date: "",
    });
  };
  /* ==============DELETE TREATMENT=============== */
  const handleDeleteTreatmentFromAppointment = (treatmentId) => {
    const filteredAppointmentTreatments =
      newAppointment.appointment_treatments.filter(
        (item) => item.treatment_id !== treatmentId
      );
    setNewAppointment({
      ...newAppointment,
      appointment_treatments: filteredAppointmentTreatments,
    });
  };

  return (
    <div className="add-appointment-popup">
      {/* ==============ADD APPOINTMENT=============== */}
      <h3 className="add-appointment-title">Add New Appointment</h3>
      <form
        onSubmit={handleSubmitAddAppointment}
        className="add-appointment-form"
      >
        <select
          className="select-treatment"
          name="patient_id"
          onChange={handleAddNewAppointment}
          required
        >
          <option value="">Select patient</option>
          {patients.map((patient) => (
            <option key={patient.patient_id} value={patient.patient_id}>
              {patient.firstname} {patient.lastname} | {patient.phone}
            </option>
          ))}
        </select>

        <label
          htmlFor="selectTreatmentInput"
          className="label-select-treatment"
        >
          Treatment:
        </label>
        <select
          className="select-treatment"
          onChange={handleAddTreatmentToAppointment}
          required
        >
          <option value="">Select treatment</option>
          {treatments.map((treatment) => (
            <option key={treatment.id} value={treatment.id}>
              {treatment.name}
            </option>
          ))}
        </select>
        <div>
          {treatments.map(
            (treatment) =>
              newAppointment.appointment_treatments.find(
                (item) => treatment.id === item.treatment_id
              ) && (
                <div className="delete-treatment" key={treatment.id}>
                  <p className="delete-treatment-name">{treatment.name}</p>
                  <button
                    className="delete-treatment-button"
                    onClick={() =>
                      handleDeleteTreatmentFromAppointment(treatment.id)
                    }
                  >
                    <img
                      src={DeleteCircle}
                      alt="delete button"
                      className="delete-treatment-img"
                    />
                  </button>
                </div>
              )
          )}
        </div>
        <input
          value={newAppointment.appointment_date}
          onChange={handleAddNewAppointment}
          name="appointment_date"
          type="datetime-local"
          required
        />
        <div className="popup-button-wrapper-addAppointment">
          <button
            className="cancel-button"
            type="button"
            onClick={handleCancel}
          >
            CANCEL
          </button>
          <button className="submit-button" type="submit">
            SAVE
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAppointment;
