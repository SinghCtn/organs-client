import React from "react";

function AvailabilityStatus({ children }) {
  let color = "";
  let show;
  switch (children) {
    case "UNAVAILABLE":
      color = "text-yellow-600";
      show = "To be donated";
      break;
    case "AVAILABLE":
      color = "text-green-700";
      break;
    case "ALLOCATED":
      color = "text-blue-600";
      break;
    case "TRANSPLANTED":
      color = "text-red-600";
      break;
  }
  return <span className={`${color} font-bold`}>{show || children}</span>;
}

export default AvailabilityStatus;
