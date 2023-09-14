import React, { useContext, useState } from "react";
import moment from "moment";
import { AppointmentsContext } from "../../contexts/AppointmentsContext";
import { TreatmentsContext } from "../../contexts/TreatmentsContext";
import axios from "axios";
import XCircleRed from "../../assets/XCircleRed.svg";
import DeleteCircle from "../../assets/DeleteCircle.svg";
import "./EditAppointment.css";

const EditAppointment = (props) => {
  const [editedAppointment, setEditedAppointment] = useState({
    patient_id: props.patient_id,
    appointment_id: props.appointments_id,
    firstname: props.firstname,
    lastname: props.lastname,
    phone: props.phone,
    treatments: props.treatments,
    appointment_date: moment(props.appointment_date).format(
      "YYYY-MM-DDTHH:mm:ss"
    ),
  });
  const { appointments, setAppointments } = useContext(AppointmentsContext);
  const { treatments } = useContext(TreatmentsContext);

  const handleEditTreatmentToAppointment = (event) => {
    const { value } = event.target;

    if (value === "") return;

    const treatmentToAdd = treatments.find(
      (treatment) => treatment.id === Number(value)
    );
    const treatmentExistInAppointment = editedAppointment.treatments.find(
      (item) => item.treatments_id === treatmentToAdd.id
    );
    if (!treatmentExistInAppointment) {
      setEditedAppointment({
        ...editedAppointment,
        treatments: [
          ...editedAppointment.treatments,
          {
            treatments_id: treatmentToAdd.id,
            treatment_price: treatmentToAdd.price,
            name: treatmentToAdd.name,
          },
        ],
      });
    }
  };
  const handleSubmitEditTreatment = (event) => {
    event.preventDefault();

    const treatmentsArrayToEdit = editedAppointment.treatments.map((item) => ({
      treatments_id: item.treatments_id,
      treatment_price: item.treatment_price,
    }));

    const appointmentToPut = {
      treatments: treatmentsArrayToEdit,
      patient_id: props.patient_id,
      appointment_date: editedAppointment.appointment_date,
    };

    axios
      .put(`/appointments/${props.appointments_id}`, appointmentToPut)
      .then((result) => {
        const updatedAppointments = appointments.map((item) =>
          item.appointments_id === props.appointments_id ? result.data : item
        );
        setAppointments(updatedAppointments);
        props.setIsEditModeActive(false);
      })
      .catch((err) => alert(err));
  };

  /* ==============DELETE TREATMENT=============== */
  const handleDeleteTreatmentFromAppointment = (treatmentId) => {
    const filteredAppointmentTreatments = editedAppointment.treatments.filter(
      (treatment) => treatment.treatments_id !== treatmentId
    );

    setEditedAppointment({
      ...editedAppointment,
      treatments: filteredAppointmentTreatments,
    });
  };

  const handleEditAppointmentDate = (event) => {
    const { name, value } = event.target;

    setEditedAppointment({ ...editedAppointment, [name]: value });
  };

  /* ==============DELETE APPOINTMENTS=============== */
  const handleDeleteAppointment = (appointmentId) => {
    const deleteConfirmation = window.confirm(
      "Are you sure you want to delete this appointment?"
    );

    if (deleteConfirmation) {
      //setIsEditModeActive(false);
      axios
        .delete(`/appointments/${appointmentId}`)
        .then((response) => {
          const filteredAppointments = appointments.filter(
            (appointment) => appointment.appointments_id !== appointmentId
          );

          setAppointments(filteredAppointments);
        })
        .catch((error) => alert(error));
    }
  };

  return (
    <div className="edit-appointment-popup">
      {/* ==============EDIT APPOINTMENT=============== */}
      <h3 className="edit-appointment-title">View/edit Appointment</h3>
      <form
        onSubmit={handleSubmitEditTreatment}
        className="edit-appointment-form"
      >
        <p className="edit-appointment-name">
          {editedAppointment.firstname} {editedAppointment.lastname}
        </p>
        <p className="edit-appointment-name"> {editedAppointment.phone}</p>

        <label
          htmlFor="selectTreatmentInput"
          className="label-select-treatment"
        >
          Treatment:{" "}
        </label>
        <select
          onChange={handleEditTreatmentToAppointment}
          className="select-treatment"
        >
          <option value="">Select treatment</option>
          {treatments.map((treatment) => (
            <option key={treatment.id} value={treatment.id}>
              {treatment.name}
            </option>
          ))}
        </select>

        <div className="delete-treatment-wrapper">
          {editedAppointment.treatments.map((treatment) => (
            <div className="delete-treatment" key={treatment.id}>
              <p className="delete-treatment-name">{treatment.name}</p>
              <button
                className="delete-treatment-button"
                onClick={() =>
                  handleDeleteTreatmentFromAppointment(treatment.treatments_id)
                }
              >
                <img
                  src={DeleteCircle}
                  alt="delete button"
                  className="delete-treatment-img"
                />
              </button>
            </div>
          ))}
        </div>
        <input
          onChange={handleEditAppointmentDate}
          value={editedAppointment.appointment_date}
          name="appointment_date"
          type="datetime-local"
          required
        />
        <div className="popup-button-wrapper">
          <button
            type="button"
            onClick={() =>
              handleDeleteAppointment(editedAppointment.appointment_id)
            }
            className="appointments-delete-button"
          >
            DELETE
          </button>
          <button
            className="cancel-button"
            type="button"
            onClick={() => props.setIsEditModeActive(false)}
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

export default EditAppointment;
