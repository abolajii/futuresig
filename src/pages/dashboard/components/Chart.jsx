import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import styled from "styled-components";
import { getRevenue } from "../../../api/request";

// Register chart.js components
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const ChartContainer = styled.div`
  flex: 1.95;
  height: 400px;
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  margin: 15px 0;
`;

const LoadingMessage = styled.div`
  color: white;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
`;

const EmptyDataMessage = styled.div`
  color: white;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
`;

const Charts = () => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Convert long month names to short month names
  const getShortMonth = (longMonth) => {
    const monthMap = {
      January: "Jan",
      February: "Feb",
      March: "Mar",
      April: "Apr",
      May: "May",
      June: "Jun",
      July: "Jul",
      August: "Aug",
      September: "Sep",
      October: "Oct",
      November: "Nov",
      December: "Dec",
    };
    return monthMap[longMonth] || longMonth;
  };

  // Convert date string to month
  const getMonthFromDate = (dateString) => {
    // Check if dateString is actually a date string or just a month name
    if (dateString && !dateString.includes("-")) {
      return getShortMonth(dateString);
    }

    const date = new Date(dateString);
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return monthNames[date.getMonth()];
  };

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const response = await getRevenue();

        // Sort data by month/year
        const sortedData = [...response.data].sort((a, b) => {
          if (a.year !== b.year) return a.year - b.year;

          const months = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ];
          return months.indexOf(a.month) - months.indexOf(b.month);
        });

        const formattedData = sortedData.map((data) => ({
          month: getShortMonth(data.month),
          revenue: data.total_revenue,
          expenses: data.total_withdrawal,
        }));

        setMonthlyData(formattedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching revenue data:", error);
        setLoading(false);
      }
    };
    fetchRevenue();
  }, []);

  const maxValue =
    monthlyData.length > 0
      ? Math.max(
          ...monthlyData.map((d) => d.revenue || 0),
          ...monthlyData.map((d) => d.expenses || 0),
          4000 // Ensure minimum scale
        )
      : 1000;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: { color: "#ffffff" },
        grid: { color: "rgba(255, 255, 255, 0.2)" },
      },
      y: {
        beginAtZero: true,
        max: Math.ceil(maxValue / 1000) * 1000, // Round to next thousand
        grid: { color: "rgba(255, 255, 255, 0.2)" },
        ticks: {
          color: "#ffffff",
          callback: (value) => `$${value.toLocaleString()}`,
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: "#ffffff",
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => `$${context.raw.toLocaleString()}`,
        },
      },
    },
  };

  const data = {
    labels: monthlyData.map((d) => d.month),
    datasets: [
      {
        label: "Revenue",
        data: monthlyData.map((d) => d.revenue || 0),
        backgroundColor: "rgba(75, 192, 77, 0.9)", // Light green bars
        borderColor: "#50ed3b",
        borderWidth: 1,
      },
      {
        label: "Withdrawals",
        data: monthlyData.map((d) => d.expenses || 0),
        backgroundColor: "rgba(255, 99, 132, 0.9)", // Red bars for withdrawals
        borderColor: "#ff6384",
        borderWidth: 1,
      },
    ],
  };

  const hasData = monthlyData.some((d) => d.revenue > 0 || d.expenses > 0);

  return (
    <ChartContainer>
      {loading ? (
        <LoadingMessage>Loading financial data...</LoadingMessage>
      ) : !hasData ? (
        <EmptyDataMessage>
          No financial data available for this period
        </EmptyDataMessage>
      ) : (
        <Bar data={data} options={options} height={350} />
      )}
    </ChartContainer>
  );
};

export default Charts;
