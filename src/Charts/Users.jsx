import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, Title); // Register necessary components

const DonutChart = ({ userData }) => {
  const data = {
    labels: Object.keys(userData),
    datasets: [
      {
        label: "Users",
        data: Object.keys(userData).map((key) => userData[key]),
        backgroundColor: ["#ff4757", "#1e90ff"],
        borderColor: "white",
        borderWidth: 2,
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

  return <Doughnut data={data} options={options} />;
};

export default DonutChart;
