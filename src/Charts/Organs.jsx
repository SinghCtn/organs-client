import { PolarArea } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

const Organs = ({ organData }) => {
  const data = {
    labels: [
      "HEART",
      "LUNGS",
      "LIVER",
      "KIDNEY",
      "PANCREAS",
      "INTESTINES",
      "CORNEA",
      "SKIN",
      "BONE",
      "TENDON",
      "HEART_VALVE",
      "VEINS",
      "ARTERIES",
    ],
    datasets: [
      {
        label: "Organs",
        data: organData,
        backgroundColor: [
          "#ff4757", // HEART
          "#1e90ff", // LUNGS
          "#ffcc00", // LIVER
          "#8e44ad", // KIDNEY
          "#ff8c00", // PANCREAS
          "#f1c40f", // INTESTINES
          "#bdc3c7", // CORNEA
          "#e67e22", // SKIN
          "#95a5a6", // BONE
          "#2ecc71", // TENDON
          "#c0392b", // HEART_VALVE
          "#16a085", // VEINS
          "#d35400", // ARTERIES
        ],
        borderColor: [
          "#ff4757", // HEART
          "#1e90ff", // LUNGS
          "#ffcc00", // LIVER
          "#8e44ad", // KIDNEY
          "#ff8c00", // PANCREAS
          "#f1c40f", // INTESTINES
          "#bdc3c7", // CORNEA
          "#e67e22", // SKIN
          "#95a5a6", // BONE
          "#2ecc71", // TENDON
          "#c0392b", // HEART_VALVE
          "#16a085", // VEINS
          "#d35400", // ARTERIES
        ],
        borderWidth: 1,
        hoverOffset: 9,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "right",
      },
      tooltip: {
        enabled: true,
      },
    },
  };
  return <PolarArea data={data} options={options} />;
};

export default Organs;
