import React            from "react"                         ;
import CircularProgress from '@mui/material/CircularProgress';

function Spinner() {
  return (
    <div className="spinner-class">
      <CircularProgress
        size={50}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
}

export default Spinner;
