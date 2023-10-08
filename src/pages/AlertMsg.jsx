import React from "react";

export default function AlertMsg(props) {
  return (
    <div className="alert alert-success">
      <strong>{props.msg}</strong>

      <button
        type="button"
        className="btn-close float-end"
        onClick={() => props.onClose(false)}
        aria-label="Close"
      ></button>
    </div>
  );
}
