import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { generateWeeklyDays } from "../../../utils";
import { AuthContext } from "../../../context/AuthContext";

const TableContainer = styled.div`
  border-radius: 0.5rem;
  overflow: hidden;
  /* border: 1px solid #333333; */
  /* background-color: #1e1e1e; */
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
`;

const Th = styled.th`
  padding: 1rem;
  background-color: #121212;
  background-color: #1e1e1e;

  /* background: #25262b; */

  color: white;
  font-weight: 600;
  font-size: 0.9rem;
  /* border-bottom: 1px solid #333333; */
`;

const Td = styled.td`
  padding: 1rem;
  /* border-bottom: 1px solid #333333; */
  vertical-align: middle;
  font-size: 0.9rem;
`;

const StatusIndicator = styled.span`
  display: inline-block;
  padding: 0.15rem 0.4rem;
  border-radius: 0.15rem;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  background-color: ${(props) => {
    switch (props.status) {
      case "Not Started":
        return "#1e90ff33"; // blue with transparency
      case "Done":
        return "#32cd3233"; // green with transparency
      case "Awaiting Next Signal":
      case "Missed First Signal":
      case "Missed Second Signal":
        return "#ff8c0033"; // orange with transparency
      case "Partial Completion":
      case "No Signals Traded":
        return "#8b451333"; // brown with transparency
      case "Completed":
      case "Pending":
      case "Active":
      default:
        return "#77889933"; // grey with transparency
    }
  }};
  color: ${(props) => {
    switch (props.status) {
      case "Not Started":
        return "#1e90ff"; // blue
      case "Done":
        return "#32cd32"; // green
      case "Awaiting Next Signal":
      case "Missed First Signal":
      case "Missed Second Signal":
        return "#ff8c00"; // orange
      case "Partial Completion":
      case "No Signals Traded":
        return "#8b4513"; // brown
      case "Completed":
      case "Pending":
      case "Active":
      default:
        return "#778899"; // grey
    }
  }};
  border: 1px solid
    ${(props) => {
      switch (props.status) {
        case "Not Started":
          return "#1e90ff66"; // blue with more opacity
        case "Done":
          return "#32cd3266"; // green with more opacity
        case "Awaiting Next Signal":
        case "Missed First Signal":
        case "Missed Second Signal":
          return "#ff8c0066"; // orange with more opacity
        case "Partial Completion":
        case "No Signals Traded":
          return "#8b451366"; // brown with more opacity
        case "Completed":
        case "Pending":
        case "Active":
        default:
          return "#77889966"; // grey with more opacity
      }
    }};
`;

const DailyProfit = ({ formatAmount }) => {
  const [weeklyData, setWeeklyData] = useState(null);
  const { currentUser } = useContext(AuthContext);

  const [signals, setSignals] = useState([
    {
      id: 1,
      title: "Signal 1",
      time: "14:00 - 14:30",
      status: "not-started",
      startHour: 14,
      startMinute: 0,
      endHour: 14,
      endMinute: 30,
      traded: false,
      capitalUpdated: false,
    },
    {
      id: 2,
      title: "Signal 2",
      time: "19:00 - 19:30",
      status: "not-started",
      startHour: 19,
      startMinute: 0,
      endHour: 19,
      endMinute: 30,
      traded: false,
      capitalUpdated: false,
    },
  ]);

  useEffect(() => {
    const result =
      generateWeeklyDays(currentUser.weekly_capital, new Date(), [], []) || [];
    setWeeklyData(result);
  }, []);

  const getStatus = (dayDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const date = new Date(dayDate);
    date.setHours(0, 0, 0, 0);

    // If the day has passed
    if (date < today) {
      return "Completed";
    }

    // If it's a future day
    if (date > today) {
      return "Pending";
    }

    // If it's the current day, check signal times and traded status
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    // Check if the first signal time has passed
    const firstSignalPassed =
      currentHour > signals[0].endHour ||
      (currentHour === signals[0].endHour &&
        currentMinute > signals[0].endMinute);

    // Check if the second signal time has passed
    const secondSignalPassed =
      currentHour > signals[1].endHour ||
      (currentHour === signals[1].endHour &&
        currentMinute > signals[1].endMinute);

    // Check if we're before first signal
    if (!firstSignalPassed && !signals[0].traded) {
      return "Not Started";
    }

    // Check if we're between signals
    if (firstSignalPassed && !secondSignalPassed) {
      if (signals[0].traded && !signals[1].traded) {
        return "Awaiting Next Signal";
      } else if (!signals[0].traded) {
        // If first signal time passed but wasn't traded
        return "Missed First Signal";
      }
    }

    // After all signals have passed
    if (secondSignalPassed) {
      if (signals[0].traded && signals[1].traded) {
        return "Done";
      } else if (signals[0].traded && !signals[1].traded) {
        return "Missed Second Signal";
      } else if (!signals[0].traded && signals[1].traded) {
        // Unusual case but possible
        return "Partial Completion";
      } else {
        return "No Signals Traded";
      }
    }

    // Default case
    return "Active";
  };

  const result = weeklyData?.weekdays;

  function formatDate(dateString) {
    const date = new Date(dateString);

    // Get day of month (1-31)
    const day = date.getDate();

    // Add ordinal suffix (st, nd, rd, th)
    let suffix = "th";
    if (day % 10 === 1 && day !== 11) {
      suffix = "st";
    } else if (day % 10 === 2 && day !== 12) {
      suffix = "nd";
    } else if (day % 10 === 3 && day !== 13) {
      suffix = "rd";
    }

    // Format with weekday, month name, day with ordinal suffix, and year
    return date
      .toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
      .replace(/\d+/, day + suffix);
  }

  return (
    <div>
      <TableContainer>
        <Table>
          <thead>
            <tr>
              <Th>Date</Th>
              <Th>Signal 1 Capital</Th>
              <Th>Signal 1 Profit</Th>
              <Th>Signal 2 Capital</Th>
              <Th>Signal 2 Profit</Th>
              <Th>Total Profit</Th>
              <Th>Final Capital</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {result?.map((d) => {
              // Get status based on the date and signals
              const status = getStatus(d.date);

              return (
                <tr key={d.date}>
                  <Td>{formatDate(d.date)}</Td>
                  <Td>{formatAmount(d.firstTrade.totalAmount)}</Td>
                  <Td>{formatAmount(d.firstTrade.profit)}</Td>
                  <Td>{formatAmount(d.secondTrade.totalAmount)}</Td>
                  <Td>{formatAmount(d.secondTrade.profit)}</Td>
                  <Td>{formatAmount(d.totalProfit)}</Td>
                  <Td>{formatAmount(d.finalBalance)}</Td>
                  <Td>
                    <StatusIndicator status={status}>{status}</StatusIndicator>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default DailyProfit;
