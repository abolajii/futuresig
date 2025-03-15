import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { generateWeeklyDays } from "../../../utils";
import { AuthContext } from "../../../context/AuthContext";
import { getAllDeposits, getWithdrawal } from "../../../api/request";

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
  padding: 0.15rem 0.4rem;
  /* min-width: 140px; */
  border-radius: 0.15rem;
  font-size: 0.75rem;
  font-weight: 500;
  flex: 1;
  letter-spacing: 0.02em;
  background-color: ${(props) => {
    switch (props.status) {
      case "Not Started":
        return "#1e90ff33"; // blue with transparency
      case "Done":
        return "#32cd3233"; // green with transparency
      case "Awaiting Next Signal":
        return "#ff8c0033"; // orange with transparency
      case "Missed First Signal":
        return "#ff69b433"; // pink with transparency
      case "Missed Second Signal":
        return "#ffd70033"; // gold with transparency
      case "Partial Completion":
        return "#8b451333"; // brown with transparency
      case "No Signals Traded":
        return "#9370db33"; // medium purple with transparency
      case "Active":
        return "#32cd3266"; // light green-gray
      case "Completed":
        return "#20b2aa33"; // light sea green with transparency
      case "Pending":
        return "#77889933"; // grey with transparency
      default:
        return "#80808033"; // darker grey with transparency
    }
  }};
  color: ${(props) => {
    switch (props.status) {
      case "Not Started":
        return "#1e90ff"; // blue
      case "Done":
        return "#32cd32"; // green
      case "Awaiting Next Signal":
        return "#ff8c00"; // orange
      case "Missed First Signal":
        return "#ff69b4"; // pink
      case "Missed Second Signal":
        return "#ffd700"; // gold
      case "Partial Completion":
        return "#8b4513"; // brown
      case "No Signals Traded":
        return "#9370db"; // medium purple
      case "Active":
        return "#32cd32"; // green
      case "Completed":
        return "#20b2aa"; // light sea green
      case "Pending":
        return "#778899"; // slate grey
      default:
        return "#808080"; // darker grey
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
          return "#ff8c0066"; // orange with more opacity
        case "Missed First Signal":
          return "#ff69b466"; // pink with more opacity
        case "Missed Second Signal":
          return "#ffd70066"; // gold with more opacity
        case "Partial Completion":
          return "#8b451366"; // brown with more opacity
        case "No Signals Traded":
          return "#9370db66"; // medium purple with more opacity
        case "Active":
          return "#32cd3266"; // green with more opacity
        case "Completed":
          return "#20b2aa66"; // light sea green with more opacity
        case "Pending":
          return "#77889966"; // slate grey with more opacity
        default:
          return "#80808066"; // darker grey with more opacity
      }
    }};
`;

const mapping = {
  "before-trade": 0,
  "inbetween-trade": 1,
  "after-trade": 2,
};

const DailyProfit = ({ formatAmount }) => {
  const [weeklyData, setWeeklyData] = useState(null);
  const { currentUser } = useContext(AuthContext);

  const [deposits, setDeposits] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);

  const fetchDeposits = async () => {
    try {
      const response = await getAllDeposits();
      const withdrawResponse = await getWithdrawal();

      const formattedExpenses = withdrawResponse.data.map((e) => ({
        date: e.date.split("T")[0],
        amount: e.amount,
        whenWithdraw: mapping[e.whenWithdraw],
        id: e._id,
      }));

      const formattedDeposits = response.data?.map((d) => ({
        date: d.date.split("T")[0],
        amount: d.amount,
        bonus: d.bonus,
        whenDeposited: mapping[d.whenDeposited],
      }));

      setDeposits(formattedDeposits);
      setWithdrawals(formattedExpenses);
    } catch (error) {
      console.error("Error fetching deposits:", error);
    }
  };

  useEffect(() => {
    fetchDeposits();
  }, []);

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
    const result = generateWeeklyDays(
      currentUser.weekly_capital,
      new Date(),
      deposits,
      withdrawals
    );
    setWeeklyData(result);
  }, [withdrawals]);

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
    if (firstSignalPassed) {
      // if (signals[0].traded && !signals[1].traded) {
      //   return "Awaiting Next Signal";
      // } else if (!signals[0].traded) {
      //   // If first signal time passed but wasn't traded
      //   return "Missed First Signal";
      // }
    }

    // After all signals have passed
    if (secondSignalPassed) {
      // if (signals[0].traded && signals[1].traded) {
      //   return "Done";
      // } else if (signals[0].traded && !signals[1].traded) {
      //   return "Missed Second Signal";
      // } else if (!signals[0].traded && signals[1].traded) {
      //   // Unusual case but possible
      //   return "Partial Completion";
      // } else {
      //   return "No Signals Traded";
      // }
    }

    // Default case
    return "Active";
  };

  const result = weeklyData?.weekdays;

  console.log(result);

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
