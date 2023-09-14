import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { PatientsContext } from "../../contexts/PatientsContext";
import teethmap from "../../assets/teethmap.png";
import { TreatmentsContext } from "../../contexts/TreatmentsContext";
import { AppointmentsContext } from "../../contexts/AppointmentsContext";
import "./EditViewPatient.css";
import AddNewPatientIcon from "../../assets/AddNewPatientIcon.svg";
import CheckCircleGreen from "../../assets/CheckCircleGreen.svg";
import XCircleRed from "../../assets/XCircleRed.svg";
import { v4 as uuidv4 } from "uuid";

const EditViewPatient = (props) => {
  const { patients, setPatients } = useContext(PatientsContext);
  const { treatments } = useContext(TreatmentsContext);
  const { appointments } = useContext(AppointmentsContext);

  const [viewEditPatient, setViewEditPatient] = useState({
    firstname: "",
    lastname: "",
    phone: "",
    email: "",
    occupation: "",
    birth_date: "",
    created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
    gender: "",
    has_hbd: false,
    has_diabetes: false,
    has_active_medication: false,
    has_alergies: false,
    active_medication: "",
    alergies: "",
  });

  const [viewEditPatientTreatments, setViewEditPatientTreatments] = useState(
    []
  );
  const [viewEditPatientTreatmentsForm, setViewEditPatientTreatmentsForm] =
    useState({
      teeth_map_id: "",
      treatments_id: "",
      tooth: "",
      dental_status: "",
    });

  const teethTreatmentsArrDropdown = [
    11, 12, 13, 14, 15, 16, 17, 18, 21, 22, 23, 24, 25, 26, 27, 28, 31, 32, 33,
    34, 35, 36, 37, 38, 41, 42, 43, 44, 45, 46, 47, 48,
  ];

  useEffect(() => {
    let patientViewEditId = Number(props.match.params.id);
    const foundPatient = patients.find(
      (patient) => patient.patient_id === patientViewEditId
    );
    if (foundPatient) {
      const { teeth_treatments, created_at, ...patientInfo } = foundPatient;
      setViewEditPatient(patientInfo);
      setViewEditPatientTreatments(
        teeth_treatments.map((item) => ({ ...item, alreadyExists: true }))
      );
    }
  }, [patients]);

  const handleSubmitViewEditPatient = (event) => {
    event.preventDefault();

    const patientId = Number(props.match.params.id);

    viewEditPatient.birth_date = moment(viewEditPatient.birth_date).format(
      "YYYY-MM-DD"
    );

    axios
      .put(`/patients/${patientId}`, viewEditPatient)
      .then((response) => {
        const updatedPatient = response.data[0];
        const updatedPatientTeethTreatmentsPromises = [];

        viewEditPatientTreatments
          .filter((treatment) => !treatment.alreadyExists)
          .map((treatment) => {
            const newTreatment = {
              ...treatment,
              teeth_map_id: response.data[0].teeth_map_id,
            };

            const { temporary_id, ...newTreatmentWithoutTempId } = newTreatment;

            const teethTreatmentPost = axios.post(
              "/patients/teeth-treatments",
              newTreatmentWithoutTempId
            );

            updatedPatientTeethTreatmentsPromises.push(teethTreatmentPost);
          });

        Promise.all(updatedPatientTeethTreatmentsPromises).then((items) => {
          items.map((item) => updatedPatient.teeth_treatments.push(item.data));
          const patientsWithEditedInfo = patients.map((patient) =>
            patient.patient_id === Number(props.match.params.id)
              ? updatedPatient
              : patient
          );
          setPatients(patientsWithEditedInfo);
          alert("Patient information has been updated");
          props.history.push("/patients");
        });
      })
      .catch((error) => alert(error));
  };

  const handleChangeViewEditPatient = (event) => {
    const { name, value } = event.target;
    setViewEditPatient({ ...viewEditPatient, [name]: value });
  };

  const handleCheckBox = (event) => {
    const { name, checked } = event.target;
    setViewEditPatient({ ...viewEditPatient, [name]: checked });
  };

  {
    /*------------- Teeth Map --------------*/
  }

  const handleChangeViewEditPatientTeethMap = (event) => {
    const { name, value } = event.target;
    setViewEditPatientTreatmentsForm({
      ...viewEditPatientTreatmentsForm,
      [name]: value,
    });
  };

  const handleSubmitViewEditPatientTeethMap = (event) => {
    event.preventDefault();
    setViewEditPatientTreatments([
      ...viewEditPatientTreatments,
      { ...viewEditPatientTreatmentsForm, temporary_id: uuidv4() },
    ]);
    setViewEditPatientTreatmentsForm({
      teeth_map_id: "",
      treatments_id: "",
      tooth: "",
      dental_status: "",
    });
  };

  const deleteTeethTreatmentHandler = (teethTreatment) => {
    const deleteTeethTreatmentConfirm = window.confirm(
      "Are you sure you want to delete this treatment?"
    );

    // treatment.teeth_treatment_id

    if (deleteTeethTreatmentConfirm) {
      axios
        .delete(
          `/patients/teeth-treatments/${teethTreatment.teeth_treatment_id}`
        )
        .then((response) => {
          const filteredTeethTreatments = viewEditPatientTreatments.filter(
            (treatment) =>
              treatment.teeth_treatment_id !==
              Number(teethTreatment.teeth_treatment_id)
          );
          setViewEditPatientTreatments(filteredTeethTreatments);
        })
        .catch((err) => {
          const filteredTeethTreatments = viewEditPatientTreatments.filter(
            (treatment) => {
              console.log("teethTreatment_tempId", teethTreatment.temporary_id);
              console.log("treatment_id", treatment.temporary_id);
              return treatment.temporary_id !== teethTreatment.temporary_id;
            }
          );
          setViewEditPatientTreatments(filteredTeethTreatments);
        });
    }
  };

  return (
    <div className="patient-container">
      <h1 className="patient-title">
        <span>
          <img src={AddNewPatientIcon} alt="edit patient" />
        </span>
        Edit Patient
      </h1>
      <form
        className="patient-personalInfo-form"
        onSubmit={handleSubmitViewEditPatient}
      >
        <h3>Personal information</h3>
        <div className="patient-form-personalInfo-container">
          <input
            name="firstname"
            value={viewEditPatient.firstname}
            placeholder="First name"
            onChange={handleChangeViewEditPatient}
            required
          />
          <input
            name="lastname"
            value={viewEditPatient.lastname}
            placeholder="Last name"
            onChange={handleChangeViewEditPatient}
            required
          />
          <input
            name="phone"
            value={viewEditPatient.phone}
            placeholder="Phone number"
            onChange={handleChangeViewEditPatient}
            required
          />
          <input
            name="email"
            value={viewEditPatient.email}
            placeholder="E-mail"
            onChange={handleChangeViewEditPatient}
            type="email"
            required
          />
          <input
            name="occupation"
            value={viewEditPatient.occupation}
            placeholder="Occupation"
            onChange={handleChangeViewEditPatient}
            required
          />
          <div className="patient-form-personalInfo-birthDate">
            <label htmlFor="birth_date">Date of Birth</label>
            <input
              name="birth_date"
              value={moment(viewEditPatient.birth_date).format("YYYY-MM-DD")}
              type="date"
              onChange={handleChangeViewEditPatient}
              required
              id="birth_date"
            />
          </div>
          <select
            name="gender"
            value={viewEditPatient.gender}
            onChange={handleChangeViewEditPatient}
            required
          >
            <option value="">Gender</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <h3>Medical background</h3>
        <div className="patient-form-medicalBackground-checkboxes">
          <div>
            <label htmlFor="hbp">High Blood Pressure</label>
            <input
              name="has_hbd"
              type="checkbox"
              onChange={handleCheckBox}
              checked={viewEditPatient.has_hbd}
              id="hbp"
            />
          </div>
          <div>
            <label htmlFor="diabetes">Diabetes</label>
            <input
              name="has_diabetes"
              type="checkbox"
              onChange={handleCheckBox}
              checked={viewEditPatient.has_diabetes}
              id="diabetes"
            />
          </div>
          <div>
            <label htmlFor="active_medication">Active Medication</label>
            <input
              name="has_active_medication"
              type="checkbox"
              onChange={handleCheckBox}
              checked={viewEditPatient.has_active_medication}
              id="active_medication"
            />
          </div>
          <div>
            <label htmlFor="allergies">Allergies</label>
            <input
              name="has_alergies"
              type="checkbox"
              onChange={handleCheckBox}
              checked={viewEditPatient.has_alergies}
              id="allergies"
            />
          </div>
        </div>
        <div className="patient-form-medicalBackground-textInputs">
          <input
            name="alergies"
            value={viewEditPatient.alergies}
            placeholder="Allergies"
            onChange={handleChangeViewEditPatient}
          />
          <input
            name="active_medication"
            value={viewEditPatient.active_medication}
            placeholder="Active Medication"
            onChange={handleChangeViewEditPatient}
          />
        </div>
        <button className="submitButton" type="submit">
          <img src={CheckCircleGreen} alt="submit button" />
        </button>
      </form>
      {/*------------- Teeth Map --------------*/}
      <div className="teeth-map">
        <h3>Teeth Map</h3>
        <div className="teeth-map-img-container">
          <img className="teeth-map-img" src={teethmap} alt="teeth map" />
        </div>
        {viewEditPatientTreatments.map((treatment) => (
          <div key={treatment.treatments_id} className="teeth-map-treatment">
            <p>{treatment.tooth}</p>
            <p>{treatment.dental_status}</p>
            {treatments.map((item) =>
              Number(treatment.treatments_id) === item.id ? (
                <p key={item.id}>{item.name}</p>
              ) : null
            )}
            <button
              onClick={() => deleteTeethTreatmentHandler(treatment)}
              className="teeth-map-deleteTreatment"
            >
              <img src={XCircleRed} alt="delete treatment" />
            </button>
          </div>
        ))}

        <form
          className="teeth-map-form"
          onSubmit={handleSubmitViewEditPatientTeethMap}
        >
          <div className="teeth-map-form-container">
            <select
              name="tooth"
              value={viewEditPatientTreatmentsForm.tooth}
              onChange={handleChangeViewEditPatientTeethMap}
            >
              <option value="">Tooth</option>
              {teethTreatmentsArrDropdown.map((tooth) => (
                <option key={tooth} value={tooth}>
                  {tooth}
                </option>
              ))}
            </select>
            <input
              name="dental_status"
              value={viewEditPatientTreatmentsForm.dental_status}
              placeholder="Dental status"
              onChange={handleChangeViewEditPatientTeethMap}
            />
            <select
              value={viewEditPatientTreatmentsForm.treatments_id}
              name="treatments_id"
              onChange={handleChangeViewEditPatientTeethMap}
            >
              <option value="">Treatment</option>
              {treatments.map((treatment) => (
                <option key={treatment.id} value={treatment.id}>
                  {treatment.name}
                </option>
              ))}
            </select>
          </div>
          <button type="submit">+ New Line</button>
        </form>
      </div>
      <div className="patient-appointments-container">
        <h3>Appointments</h3>
        {appointments.length > 0 &&
          appointments
            .sort((a, b) => (a.appointment_date < b.appointment_date ? 1 : -1))
            .filter((item) => item.patient_id === Number(props.match.params.id))
            .map((element, index) => (
              <div className="patient-appointments" key={index}>
                <div className="patient-appointments-time">
                  <p>{moment(element.appointment_date).format("HH:mm")}</p>
                  <p>{moment(element.appointment_date).format("DD/MM/YYYY")}</p>
                </div>
                <div className="patient-appointments-treatments">
                  <p>Appointment for</p>
                  <ul>
                    {element.treatments.map((item) => (
                      <li
                        className="patient-appointments-treatments-li"
                        key={item.id}
                      >
                        {item.name}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
        {appointments.filter(
          (item) => item.patient_id === Number(props.match.params.id)
        ).length === 0 && (
          <p className="patient-noAppointments">
            No appointments for this patient.
          </p>
        )}
      </div>
    </div>
  );
};

export default EditViewPatient;
