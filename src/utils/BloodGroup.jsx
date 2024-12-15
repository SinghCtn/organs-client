import React from "react";

function BloodGroup({ children }) {
  let bloodGroup;
  switch (children) {
    case "A_POSITIVE":
      bloodGroup = "A+";
      break;
    case "A_NEGATIVE":
      bloodGroup = "A-";
      break;
    case "B_POSITIVE":
      bloodGroup = "B+";
      break;
    case "B_NEGATIVE":
      bloodGroup = "B-";
      break;
    case "AB_POSITIVE":
      bloodGroup = "AB+";
      break;
    case "AB_NEGATIVE":
      bloodGroup = "AB-";
      break;
    case "O_POSITIVE":
      bloodGroup = "O+";
      break;
    case "O_NEGATIVE":
      bloodGroup = "O-";
      break;
    default:
      bloodGroup = "Unknown";
  }
  return <span>{bloodGroup}</span>;
}

export default BloodGroup;
