import React, { useState, useEffect, useContext } from "react";
import "../Homepage/Homepage.css";
import axios from "axios";
import moment from "moment";
import { AppointmentsContext } from "../../contexts/AppointmentsContext";
import EditAppointment from "../../components/EditAppointment/EditAppointment";
import Footer from "../../components/Footer/Footer";
import AddAppointment from "../../components/AddAppointment/AddAppointment";
import calendarLight from "../../assets/calendarLight.svg";
import CaretRightBlue from "../../assets/CaretRightBlue.svg";
import X from "../../assets/X.svg";
import Modal from "../../components/Modal/Modal";

const Homepage = () => {
  const [todos, setTodos] = useState([]);
  const [isAddNewTodoShown, setIsAddNewTodoShown] = useState(false);
  const [addNewTodo, setAddNewTodo] = useState({
    todo_item: "",
  });
  const [isEditModeActive, setIsEditModeActive] = useState(false);
  const [appointmentId, setAppointmentId] = useState(0);
  const [isAddNewAppointmentShown, setIsAddNewAppointmentShown] =
    useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  const { appointments } = useContext(AppointmentsContext);

  /* ==============APPOINTMENTS=============== */
  const currentDate = moment().format("dddd Do MMMM YYYY");

  /* ==============TODOS=============== */
  const fetchTodos = () => {
    axios
      .get("/todos")
      .then((response) => setTodos(response.data))
      .catch((error) => alert(error));
  };

  /* ==============HANDLE APPOINTMENT ID ON CLICK=============== */
  const handleAppointmentIdOnClick = (id) => {
    setAppointmentId(id);
    setIsEditModeActive(true);
  };

  /* ==============DELETE TODOS=============== */
  const handleDelete = (todoId) => {
    const deleteConfirmation = window.confirm(
      "Are you sure you want to delete this to do item?"
    );

    if (deleteConfirmation) {
      axios
        .delete(`/todos/${todoId}`)
        .then((response) => {
          const filteredTodos = todos.filter((todo) => todo.id !== todoId);
          setTodos(filteredTodos);
        })
        .catch((error) => alert(error));
    }
  };

  /* ==============ADD TODO=============== */
  const handleAddNewTodo = (event) => {
    const { name, value } = event.target;
    setAddNewTodo({ [name]: value });
  };

  const handleSubmitNewAddTodo = (event) => {
    event.preventDefault();
    axios
      .post("/todos", addNewTodo)
      .then((response) => {
        setTodos([...todos, response.data]);
        setIsAddNewTodoShown(false);
      })
      .catch((error) => alert(error));
  };

  const handleClickAddTodoButton = () => {
    setIsAddNewTodoShown(true);
    setAddNewTodo({
      todo_item: "",
    });
  };

  return (
    <div className="homepage-container">
      <div className="title-container">
        <img
          src={calendarLight}
          alt="calendar_icon"
          className="calendar-icon"
        />
        <h1 className="current-date-text">{currentDate}</h1>
      </div>

      <h1 className="appointments-title">Appointments</h1>
      {isAddNewAppointmentShown ? (
        <Modal>
          <AddAppointment
            setIsAddNewAppointmentShown={setIsAddNewAppointmentShown}
          />
        </Modal>
      ) : null}
      {appointments
        .sort((a, b) => (a.appointment_date > b.appointment_date ? 1 : -1))
        .filter(
          (appointment) =>
            moment(appointment.appointment_date).format("dddd Do MMMM YYYY") ===
            moment.utc(moment()).format("dddd Do MMMM YYYY")
        )
        .map((appointment) => (
          <div
            key={appointment.appointments_id}
            className="each-appointments-container"
          >
            <button
              className="appointment-button"
              onClick={() =>
                handleAppointmentIdOnClick(appointment.appointments_id)
              }
            >
              <div className="appointments-info">
                <p className="appointment-date">
                  {moment(appointment.appointment_date).format("HH:mm")}
                </p>
                <p className="appointment-patient-name">
                  {appointment.firstname} {appointment.lastname}{" "}
                </p>
                <span>
                  <img
                    src={CaretRightBlue}
                    alt="blue arrow"
                    className="patients-info-arrow"
                  />
                </span>
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

      {appointments.filter(
        (appointment) =>
          moment(appointment.appointment_date).format("dddd Do MMMM YYYY") ===
          moment.utc(moment()).format("dddd Do MMMM YYYY")
      ).length === 0 && <p>No appointments for today</p>}

      <div className="todos-container">
        <h1 className="todos-title">To do</h1>
        <hr
          className="todo-line"
          style={{
            width: "100%",
          }}
        />

        {todos.map((todo) => (
          <div className="todo-container">
            <div key={todo.id} className="each-todo-container">
              <p className="todo-name">{todo.todo_item}</p>
              <button
                onClick={() => handleDelete(todo.id)}
                className="delete-todo-button"
              >
                <img src={X} alt="X" style={{ height: 15 }} />
              </button>
            </div>
            <hr className="todo-line" />
          </div>
        ))}
      </div>

      <div>
        {isAddNewTodoShown ? (
          <Modal>
            <form className="addtodo-form" onSubmit={handleSubmitNewAddTodo}>
              <div className="addtodo-container">
                <label className="addtodo-container-label" htmlFor="todo_item">
                  Add to do item
                </label>
                <input
                  value={addNewTodo.todo_item}
                  onChange={handleAddNewTodo}
                  name="todo_item"
                  id="todo_item"
                  placeholder="To do"
                  className="addtodo-input"
                />
              </div>
              <div className="addtodo-buttons-container">
                {" "}
                <button
                  className="cancel-todo"
                  onClick={() => setIsAddNewTodoShown(false)}
                >
                  CANCEL
                </button>
                <button className="add-todo" type="submit">
                  ADD
                </button>
              </div>
            </form>
          </Modal>
        ) : (
          <div className="add-todo-button-container">
            <button
              onClick={handleClickAddTodoButton}
              className="add-todo-button"
            >
              + Add to do
            </button>
          </div>
        )}
      </div>

      <Footer setIsAddNewAppointmentShown={setIsAddNewAppointmentShown} />
    </div>
  );
};

export default Homepage;
