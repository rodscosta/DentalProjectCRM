import { useContext } from "react";
import { Link } from "react-router-dom";
import { PatientsContext } from "../../contexts/PatientsContext";
import "./Patients.css";
import CaretRightBlue from "../../assets/CaretRightBlue.svg";
import PlusCircleBlue from "../../assets/PlusCircleBlue.svg";
import usersLight from "../../assets/usersLight.svg";

const Patients = (props) => {
  const { patients } = useContext(PatientsContext);

  return (
    <div className="patients-wrapper">
      <div className="patients-title">
        <img
          src={usersLight}
          alt="patients-list-image"
          className="patients-title-logo"
        />
        <h1 className="patients-title-txt">Patients</h1>
      </div>

      {patients
        .sort((a, b) =>
          a.firstname > b.firstname
            ? 1
            : a.firstname === b.firstname
            ? a.lastname > b.lastname
              ? 1
              : -1
            : -1
        )
        .map((patient) => (
          <div key={patient.patient_id} className="patients-button-wrapper">
            <button
              onClick={() =>
                props.history.push(`/patients/${patient.patient_id}`)
              }
              className="patients-button"
            >
              <div className="patients-info">
                <p className="patients-info-name">
                  {patient.firstname} {patient.lastname}
                </p>
                <p className="patients-info-number">
                  {patient.phone}{" "}
                  <span>
                    <img
                      src={CaretRightBlue}
                      alt="blue arrow"
                      className="patients-info-arrow"
                    />
                  </span>
                </p>
              </div>
            </button>
          </div>
        ))}
      <Link to="/add-new-patient" className="patients-add-new-patient">
        <img
          src={PlusCircleBlue}
          alt="add patient button"
          className="add-patient-button"
        />
      </Link>
    </div>
  );
};

export default Patients;
