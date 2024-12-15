import React from "react";

function UrgencyLevel({ children }) {
  let color = "";
  switch (children) {
    case "LOW":
      color = "text-yellow-600";
      break;
    case "MODERATE":
      color = "text-green-700";
      break;
    case "HIGH":
      color = "text-blue-600";
      break;
    case "EMERGENCY":
      color = "text-red-600";
      break;
  }
  return <span className={`${color} font-bold`}>{children}</span>;
}

export default UrgencyLevel;
