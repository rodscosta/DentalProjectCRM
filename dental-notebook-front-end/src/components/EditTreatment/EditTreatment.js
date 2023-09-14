import React, { useContext, useState } from "react";
import axios from "axios";
import { TreatmentsContext } from "../../contexts/TreatmentsContext";
import Pencil from "../../assets/Pencil.svg";
import Modal from "../Modal/Modal";
import "./EditTreatment.css";

const EditTreatment = (props) => {
  const { name, price, treatments, id } = props;
  const [isEditModeActive, setIsEditModeActive] = useState(false);
  const [editTreatment, setEditedTreatment] = useState({
    id: id,
    name: name,
    price: price,
  });

  const { setTreatments } = useContext(TreatmentsContext);

  /* ==============EDIT TREATMENT=============== */
  const handleSubmitEditTreatment = (event) => {
    event.preventDefault();

    axios
      .put(`/treatments/${id}`, editTreatment)
      .then((response) => {
        const listOfEditedTreatments = treatments.map((treatment) => {
          return treatment.id === editTreatment.id ? editTreatment : treatment;
        });
        setTreatments(listOfEditedTreatments);
        setIsEditModeActive(false);
      })
      .catch((error) => console.log(error));
  };

  /* ==============EDIT TREATMENT=============== */

  const handleChangeEdit = (event) => {
    const { name, value } = event.target;
    setEditedTreatment({ ...editTreatment, [name]: value });
  };

  return (
    <div>
      {/* ==============EDIT TREATMENT=============== */}
      {isEditModeActive && (
        <Modal>
          <form className="form-container" onSubmit={handleSubmitEditTreatment}>
            <input
              className="input-name"
              value={editTreatment.name}
              onChange={handleChangeEdit}
              name="name"
              type="text"
            />
            <input
              className="input-price"
              value={editTreatment.price}
              onChange={handleChangeEdit}
              name="price"
              type="number"
            />
            <div className="editTreatment-button-container">
              <button
                className="button-cancel"
                onClick={() => setIsEditModeActive(false)}
              >
                CANCEL
              </button>
              <button className="button-save" type="submit">
                SAVE
              </button>
            </div>
          </form>
        </Modal>
      )}

      <button className="edit-button" onClick={() => setIsEditModeActive(true)}>
        <img
          src={Pencil}
          alt="edit treatment button"
          className="button-edit-treatment"
        />
      </button>
    </div>
  );
};

export default EditTreatment;
