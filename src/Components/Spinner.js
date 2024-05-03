import React from "react";
import ClipLoader from "react-spinners/ClipLoader";

function Spinner() {
  return (
    <div className="spinner-class">
      <ClipLoader
        size={150}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
}

export default Spinner;
