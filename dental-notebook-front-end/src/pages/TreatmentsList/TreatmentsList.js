import React, { useContext } from "react";
import EditTreatment from "../../components/EditTreatment/EditTreatment";
import { TreatmentsContext } from "../../contexts/TreatmentsContext";
import Money_light from "../../assets/money-light.svg";
import PlusCircleBlue from "../../assets/PlusCircleBlue.svg";
// import Pencil from "../../assets/Pencil.svg";
import Vector from "../../assets/Vector.svg";
import "./PriceList.css";
import Modal from "../../components/Modal/Modal";

const TreatmentsList = () => {
  const {
    handleDelete,
    handleAddNewTreatment,
    handleSubmitNewTreatment,
    treatments,
    setTreatments,
    newTreatment,
    isAddNewTreatmentShown,
    setIsAddNewTreatmentShown,
  } = useContext(TreatmentsContext);

  return (
    <div className="priceList-container">
      <div className="title-container">
        <img src={Money_light} className="money-pin" />
        <h1 className="title">Price List</h1>
      </div>
      {/* ==============MAP TREATMENTS=============== */}
      {treatments.map((treatment) => {
        return (
          <div className="price-container" key={treatment.id}>
            <p className="treatment-name">{treatment.name}</p>
            <div className="treatment-container">
              <p className="treatment-price">{treatment.price}$</p>

              <EditTreatment
                {...treatment}
                setTreatments={setTreatments}
                treatments={treatments}
              />

              <button
                className="delete-button2"
                onClick={() => handleDelete(treatment.id)}
              >
                <img
                  src={Vector}
                  alt="delete button"
                  className="delete-button"
                />
              </button>
            </div>
          </div>
        );
      })}
      {/* ==============ADD NEW TREATMENT=============== */}
      {isAddNewTreatmentShown ? (
        <Modal>
          <form onSubmit={handleSubmitNewTreatment}>
            <input
              className="input-treatment-name"
              value={newTreatment.name}
              onChange={handleAddNewTreatment}
              name="name"
              placeholder="Treatment"
              type="text"
            />
            <input
              className="input-treatment-price"
              value={newTreatment.price}
              onChange={handleAddNewTreatment}
              name="price"
              placeholder="Price"
              type="number"
            />
            <div className="addTreatment-button-container">
              <button
                className="button-cancel1"
                onClick={() => setIsAddNewTreatmentShown(false)}
              >
                CANCEL
              </button>
              <button className="button-save1" type="submit">
                ADD
              </button>
            </div>
          </form>
        </Modal>
      ) : (
        <button
          className="add-button"
          onClick={() => setIsAddNewTreatmentShown(true)}
        >
          <img src={PlusCircleBlue} alt="add patient button" />
        </button>
      )}
      {/* ==============ADD NEW TREATMENT END=============== */}
    </div>
  );
};

export default TreatmentsList;
