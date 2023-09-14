import { useState, useContext } from "react";
import axios from "axios";
import moment from "moment";
import Modal from "../../components/Modal/Modal";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { AppointmentsContext } from "../../contexts/AppointmentsContext";
import AddAppointment from "../../components/AddAppointment/AddAppointment";
import EditAppointment from "../../components/EditAppointment/EditAppointment";
import "./Appointments.css";
import calendarLight from "../../assets/calendarLight.svg";
import CaretRightBlue from "../../assets/CaretRightBlue.svg";

import PlusCircleBlue from "../../assets/PlusCircleBlue.svg";

const Appointments = () => {
  const [calendarDate, setCalendarDate] = useState(new Date());
  const { appointments, setAppointments } = useContext(AppointmentsContext);
  const [isEditModeActive, setIsEditModeActive] = useState(false);
  const [appointmentId, setAppointmentId] = useState(0);
  const [isAddNewAppointmentShown, setIsAddNewAppointmentShown] =
    useState(false);

  const handleAppointmentIdOnClick = (id) => {
    setAppointmentId(id);
    setIsEditModeActive(true);
  };

  return (
    <div className="appointments-wrapper">
      <div className="appointments-title">
        <img
          src={calendarLight}
          alt="appointments-title"
          className="appointments-title-logo"
        />
        <h1 className="appointments-title-txt">Appointments</h1>
      </div>
      <div className="appointments-calendar">
        <Calendar
          onChange={setCalendarDate}
          value={calendarDate}
          className="appointments-calendar-info"
        />
      </div>

      {appointments
        .sort((a, b) => (a.appointment_date > b.appointment_date ? 1 : -1))
        .filter(
          (appointment) =>
            moment(appointment.appointment_date).format("dddd Do MMMM YYYY") ===
            moment(calendarDate).format("dddd Do MMMM YYYY")
        )
        .map((appointment) => (
          <div
            key={appointment.appointments_id}
            className="appointments-button-wrapper"
          >
            <button
              onClick={() =>
                handleAppointmentIdOnClick(appointment.appointments_id)
              }
              className="appointments-button"
            >
              <div className="appointments-info">
                <p className="appointments-info-date">
                  {moment(appointment.appointment_date).format("HH:mm")}
                </p>
                <p className="appointments-info-name">
                  {appointment.firstname} {appointment.lastname}
                </p>
                <img
                  src={CaretRightBlue}
                  alt="blue arrow"
                  className="appointments-info-arrow"
                />
              </div>
            </button>

            {isEditModeActive &&
            appointment.appointments_id === appointmentId ? (
              <Modal>
                <EditAppointment
                  {...appointment}
                  setIsEditModeActive={setIsEditModeActive}
                />
              </Modal>
            ) : null}
          </div>
        ))}

      {isAddNewAppointmentShown ? (
        <Modal>
          <AddAppointment
            setIsAddNewAppointmentShown={setIsAddNewAppointmentShown}
          />
        </Modal>
      ) : (
        <button
          onClick={() => setIsAddNewAppointmentShown(true)}
          className="add-appointments"
        >
          <img
            src={PlusCircleBlue}
            alt="add appointment button"
            className="add-appointments-button"
          />
        </button>
      )}
    </div>
  );
};

export default Appointments;
