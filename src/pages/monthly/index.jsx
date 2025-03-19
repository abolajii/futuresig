import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { generateMonthData } from "../../utils";

// Styled components with dark theme
const Container = styled.div`
  background-color: #1a1a1a;
  color: #e0e0e0;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 15px;
  border-bottom: 1px solid #333;
`;

const Title = styled.h2`
  font-size: 24px;
  color: #e0e0e0;
  margin: 0;
`;

const MonthsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(370px, 1fr));
  gap: 10px;
`;

const MonthCard = styled.div`
  background-color: #252525;
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  }
`;

const MonthHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #3a3a3a;
`;

const MonthName = styled.h3`
  margin: 0;
  color: #e0e0e0;
  font-size: 18px;
`;

const WithdrawButton = styled.button`
  background-color: #2c2c2c;
  color: #e0e0e0;
  border: 1px solid #444;
  border-radius: 4px;
  padding: 5px 10px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #444;
  }
`;

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
`;

const WeekdayHeader = styled.div`
  text-align: center;
  font-size: 11px;
  color: #999;
  padding: 4px 0;
`;

const Day = styled.div`
  background-color: ${(props) => (props.isCurrentMonth ? "#333" : "#2a2a2a")};
  border-radius: 4px;
  padding: 5px;
  min-height: 32px;
  position: relative;
  cursor: pointer;
  opacity: ${(props) => (props.isCurrentMonth ? 1 : 0.6)};

  &:hover {
    background-color: #444;
  }
`;

const DayNumber = styled.div`
  font-size: 12px;
  font-weight: ${(props) => (props.today ? "bold" : "normal")};
  color: ${(props) => (props.today ? "#00bcd4" : "#e0e0e0")};
`;

const DayProfit = styled.div`
  font-size: 10px;
  color: ${(props) => (props.value >= 0 ? "#4caf50" : "#f44336")};
  margin-top: 2px;
`;

const DayTooltip = styled.div`
  position: absolute;
  bottom: calc(100% + 5px);
  left: 50%;
  transform: translateX(-50%);
  background-color: #2c2c2c;
  color: #e0e0e0;
  padding: 8px;
  border-radius: 4px;
  min-width: 150px;
  z-index: 100;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  font-size: 12px;

  &:after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-width: 5px;
    border-style: solid;
    border-color: #2c2c2c transparent transparent transparent;
  }
`;

const MonthlySummary = styled.div`
  margin-top: 15px;
  padding-top: 12px;
  border-top: 1px solid #3a3a3a;
  font-size: 12px;
  display: ${(props) => (props.isVisible ? "block" : "none")};
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
`;

const SummaryItem = styled.div`
  background-color: #2c2c2c;
  border-radius: 4px;
  padding: 8px;

  .label {
    font-size: 11px;
    color: #999;
    margin-bottom: 4px;
  }

  .value {
    font-size: 14px;
    font-weight: bold;
    color: ${(props) => {
      if (props.type === "profit")
        return props.value >= 0 ? "#4caf50" : "#f44336";
      if (props.type === "deposit") return "#2196f3";
      if (props.type === "withdraw") return "#f44336";
      return "#e0e0e0";
    }};
  }
`;

// Helper function to format dates as YYYY-MM-DD
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Original calculation functions
const calculateDayProfits = (capital, deposits = [], withdrawals = []) => {
  let adjustedCapital = capital;

  // Process deposits in order of whenDeposited
  const sortedDeposits = deposits.sort(
    (a, b) => a.whenDeposited - b.whenDeposited
  );

  const sortedWithdrawals = withdrawals.sort(
    (a, b) => a.whenWithdraw - b.whenWithdraw
  );

  // Add deposits at different stages
  sortedDeposits.forEach((depositInfo) => {
    if (depositInfo.whenDeposited === 0) {
      adjustedCapital += depositInfo.amount;
    }
  });

  sortedWithdrawals.forEach((withdrawInfo) => {
    if (withdrawInfo.whenWithdraw === 0) {
      adjustedCapital -= withdrawInfo.amount;
    }
  });

  // First trade
  const firstTradeTotalAmount = adjustedCapital * 0.01;
  const firstTradeRemainingBalance = adjustedCapital - firstTradeTotalAmount;
  const firstTradeProfit = firstTradeTotalAmount * 0.88;
  const capitalAfterFirstTrade =
    firstTradeRemainingBalance + firstTradeTotalAmount + firstTradeProfit;

  let adjustedSecondBalance = capitalAfterFirstTrade;

  // Add deposits at different stages
  sortedDeposits.forEach((depositInfo) => {
    if (depositInfo.whenDeposited === 1) {
      adjustedSecondBalance += depositInfo.amount;
    }
  });

  sortedWithdrawals.forEach((withdrawInfo) => {
    if (withdrawInfo.whenWithdraw === 1) {
      adjustedSecondBalance -= withdrawInfo.amount;
    }
  });

  // Second trade
  const secondTradeTotalAmount = adjustedSecondBalance * 0.01;
  const secondTradeRemainingBalance =
    adjustedSecondBalance - secondTradeTotalAmount;
  const secondTradeProfit = secondTradeTotalAmount * 0.88;
  const capitalAfterSecondTrade =
    secondTradeRemainingBalance + secondTradeTotalAmount + secondTradeProfit;

  let adjustedThirdBalance = capitalAfterSecondTrade;

  // Add deposits at the second stage
  sortedDeposits.forEach((depositInfo) => {
    if (depositInfo.whenDeposited === 2) {
      adjustedThirdBalance += depositInfo.amount;
    }
  });

  sortedWithdrawals.forEach((withdrawInfo) => {
    if (withdrawInfo.whenWithdraw === 2) {
      adjustedThirdBalance -= withdrawInfo.amount;
    }
  });

  return {
    startingCapital: adjustedCapital,
    finalBalance: adjustedThirdBalance,
    totalProfit: secondTradeProfit + firstTradeProfit,
    deposits: sortedDeposits,
    withdrawals: sortedWithdrawals,
    firstTrade: {
      startingCapital: adjustedCapital,
      remainingBalance: firstTradeRemainingBalance,
      profit: firstTradeProfit,
      totalAmount: firstTradeTotalAmount,
      capitalAfterTrade: adjustedSecondBalance,
    },
    secondTrade: {
      startingCapital: adjustedSecondBalance,
      totalAmount: secondTradeTotalAmount,
      remainingBalance: secondTradeRemainingBalance,
      profit: secondTradeProfit,
      capitalAfterTrade: adjustedThirdBalance,
    },
  };
};

// Function to generate month data using the calculation functions

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const Monthly = () => {
  const currentYear = new Date().getFullYear();
  const [hoveredDay, setHoveredDay] = useState(null);
  const [visibleSummaries, setVisibleSummaries] = useState({});
  const [monthsData, setMonthsData] = useState({});
  const [withdrawState, setWithdrawState] = useState({});

  const months = [
    { index: 2, name: "March" },
    { index: 3, name: "April" },
    { index: 4, name: "May" },
    { index: 5, name: "June" },
    { index: 6, name: "July" },
    { index: 7, name: "August" },
    { index: 8, name: "September" },
    { index: 9, name: "October" },
    { index: 10, name: "November" },
    { index: 11, name: "December" },
  ];

  const today = new Date();
  const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  // Generate data for all months using the calculation functions
  // Inside your Monthly component
  useEffect(() => {
    let startingCapital = 4327.76; // Initial capital
    const startDate = "2025-03-18"; // Your starting date
    const allMonthsData = {};

    // Generate data for all months
    months.forEach((month) => {
      // Create a new date for the first day of each month
      const monthStartDate = new Date(currentYear, month.index, 1);
      const formattedDate = formatDate(monthStartDate);

      // Generate month data using the imported function
      const monthData = generateMonthData(formattedDate, startingCapital);

      // Store the data and update the starting capital for the next month
      allMonthsData[month.index] = monthData;
      startingCapital = monthData.runningCapital;
    });

    setMonthsData(allMonthsData);
  }, []);

  const handleWithdraw = (monthIndex) => {
    setMonthsData((prevData) => {
      const updatedData = { ...prevData };
      const month = updatedData[monthIndex];

      if (!month) return prevData;

      const withdrawalAmount = Math.floor(month.summary.total * 0.1);
      const withdrawalDate = new Date(currentYear, monthIndex, 15); // Mid-month withdrawal
      const formattedWithdrawalDate = formatDate(withdrawalDate);

      // Create a withdrawal record
      const withdrawal = {
        date: formattedWithdrawalDate,
        amount: withdrawalAmount,
        whenWithdraw: 0, // Apply immediately
      };

      // Recalculate the current month with the withdrawal
      updatedData[monthIndex] = generateMonthData(
        formatDate(new Date(currentYear, monthIndex, 1)),
        month.summary.startingCapital,
        [], // No additional deposits
        [withdrawal] // Add the withdrawal
      );

      // Update all subsequent months
      let updatedCapital = updatedData[monthIndex].runningCapital;
      for (let i = monthIndex + 1; i <= 11; i++) {
        if (updatedData[i]) {
          // Regenerate each subsequent month with updated starting capital
          updatedData[i] = generateMonthData(
            formatDate(new Date(currentYear, i, 1)),
            updatedCapital
          );
          updatedCapital = updatedData[i].runningCapital;
        }
      }

      return updatedData;
    });

    // Visual feedback for the withdrawal
    setWithdrawState((prev) => ({
      ...prev,
      [monthIndex]: true,
    }));

    setTimeout(() => {
      setWithdrawState((prev) => ({
        ...prev,
        [monthIndex]: false,
      }));
    }, 3000);
  };

  return (
    <Container>
      <MonthsGrid>
        {months.map((month) => {
          const monthData = monthsData[month.index];
          if (!monthData) return null;

          const { days, summary } = monthData;

          return (
            <MonthCard key={month.index}>
              <MonthHeader>
                <MonthName>{month.name}</MonthName>
                <WithdrawButton
                  onClick={() => handleWithdraw(month.index)}
                  style={{
                    backgroundColor: withdrawState[month.index]
                      ? "#4caf50"
                      : "#2c2c2c",
                  }}
                >
                  {withdrawState[month.index] ? "Withdrawn" : "Withdraw"}
                </WithdrawButton>
              </MonthHeader>

              <DaysGrid>
                {weekdays.map((day) => (
                  <WeekdayHeader key={`${month.index}-${day}`}>
                    {day}
                  </WeekdayHeader>
                ))}

                {days.map((day, index) => {
                  const isToday =
                    today.getDate() === day.day &&
                    today.getMonth() === month.index &&
                    day.isCurrentMonth;

                  return (
                    <Day
                      key={`${month.index}-${index}`}
                      isCurrentMonth={day.isCurrentMonth}
                      onMouseEnter={() =>
                        setHoveredDay(`${month.index}-${index}`)
                      }
                      onMouseLeave={() => setHoveredDay(null)}
                      onClick={() =>
                        day.isCurrentMonth && toggleSummary(month.index)
                      }
                    >
                      <DayNumber today={isToday}>{day.day}</DayNumber>
                      {day.isCurrentMonth && (
                        <DayProfit value={day.profit}>
                          {day.profit >= 0 ? "+" : ""}
                          {formatCurrency(day.profit)}
                        </DayProfit>
                      )}

                      {hoveredDay === `${month.index}-${index}` &&
                        day.isCurrentMonth && (
                          <DayTooltip>
                            <div>
                              <strong>
                                {month.name} {day.day}
                              </strong>
                            </div>
                            <div
                              style={{
                                color: day.profit >= 0 ? "#4caf50" : "#f44336",
                              }}
                            >
                              Profit: {formatCurrency(day.profit)}
                            </div>
                            {day.deposit > 0 && (
                              <div style={{ color: "#2196f3" }}>
                                Deposit: {formatCurrency(day.deposit)}
                              </div>
                            )}
                            {day.withdraw > 0 && (
                              <div style={{ color: "#f44336" }}>
                                Withdraw: {formatCurrency(day.withdraw)}
                              </div>
                            )}
                            {day.details && (
                              <>
                                <div
                                  style={{
                                    marginTop: "4px",
                                    borderTop: "1px solid #444",
                                    paddingTop: "4px",
                                  }}
                                >
                                  <div>
                                    First Trade:{" "}
                                    {formatCurrency(
                                      day.details.firstTrade.profit
                                    )}
                                  </div>
                                  <div>
                                    Second Trade:{" "}
                                    {formatCurrency(
                                      day.details.secondTrade.profit
                                    )}
                                  </div>
                                </div>
                              </>
                            )}
                          </DayTooltip>
                        )}
                    </Day>
                  );
                })}
              </DaysGrid>

              <MonthlySummary isVisible>
                <SummaryGrid>
                  <SummaryItem type="profit" value={summary.profit}>
                    <div className="label">Total Profit</div>
                    <div className="value">
                      {formatCurrency(summary.profit)}
                    </div>
                  </SummaryItem>
                  <SummaryItem>
                    <div className="label">Starting Capital</div>
                    <div className="value">
                      {formatCurrency(summary.startingCapital)}
                    </div>
                  </SummaryItem>
                  <SummaryItem>
                    <div className="label">Ending Balance</div>
                    <div className="value">{formatCurrency(summary.total)}</div>
                  </SummaryItem>
                  <SummaryItem
                    type="profit"
                    value={summary.profit > 0 ? 1 : -1}
                  >
                    <div className="label">Month Growth</div>
                    <div className="value">
                      {(
                        (summary.total / summary.startingCapital - 1) *
                        100
                      ).toFixed(2)}
                      %
                    </div>
                  </SummaryItem>
                  <SummaryItem type="deposit">
                    <div className="label">Total Deposits</div>
                    <div className="value">
                      {formatCurrency(summary.deposit)}
                    </div>
                  </SummaryItem>
                  <SummaryItem type="withdraw">
                    <div className="label">Total Withdrawals</div>
                    <div className="value">
                      {formatCurrency(summary.withdraw)}
                    </div>
                  </SummaryItem>
                </SummaryGrid>
              </MonthlySummary>
            </MonthCard>
          );
        })}
      </MonthsGrid>
    </Container>
  );
};

export default Monthly;
