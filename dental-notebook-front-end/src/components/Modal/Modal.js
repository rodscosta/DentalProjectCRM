import React from "react";
import "./Modal.css";

function Modal(props) {
  return (
    <div>
      <div className="modal-container" />
      <div className="modal-inner-container">{props.children}</div>
    </div>
  );
}

export default Modal;
