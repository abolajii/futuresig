import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import {
  BarChart2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
} from "react-feather";
import { generateWeeklyDays } from "../../utils";
import { AuthContext } from "../../context/AuthContext";
import DailyCard from "./components/DailyCard";

const Container = styled.div`
  background-color: #121212;
  color: #f8f9fa;

  .daily {
    margin-top: 20px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #2c2c2c;
`;

const Title = styled.div`
  font-size: 24px;
  color: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DateSelector = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background-color: #1e1e1e;
  padding: 10px 16px;
  margin-bottom: 10px;
  border-radius: 8px;
`;

const Body = styled.div`
  display: flex;
  padding: 10px 0;
  gap: 20px;

  .one {
    display: flex;
    flex: 2;
    flex-direction: column;
  }

  .two {
    flex: 1;
    display: flex;
    margin-top: 20px;
  }
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;

  .title {
    display: flex;
    align-items: center;
    gap: 4px;
  }
`;

const NavigationButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 16px;
`;

const NavButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: #1e1e1e;
  border: none;
  color: #f8f9fa;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background-color: #2c2c2c;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;

    &:hover {
      background-color: #1e1e1e;
    }
  }
`;

const DayCardContainer = styled.div`
  background-color: #1e1e1e;
  border-radius: 12px;
  margin-bottom: 16px;
  overflow: hidden;
  border-left: ${(props) =>
    props.isToday ? "4px solid #4ade80" : "4px solid transparent"};
`;

const CurrencyToggle = styled.button`
  background: ${(props) => (props.active ? "#4c6ef5" : "#2c2d30")};
  color: white;
  border: none;
  padding: 0.4rem;
  font-size: 15px;
  border-radius: 6px;
  cursor: pointer;
  margin-right: 0.5rem;
  transition: background-color 0.2s;
  margin-bottom: 10px;
  &:hover {
    background: ${(props) => (props.active ? "#4c6ef5" : "#3c3d40")};
  }
`;

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const Weekly = () => {
  const [weekOffset, setWeekOffset] = useState(0);
  const [weeklyData, setWeeklyData] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const [expandedDays, setExpandedDays] = useState({});
  const [currentWeekTotal, setCurrentWeekTotal] = useState(0);
  const [nextWeekTotal, setNextWeekTotal] = useState(0);

  const difference = currentWeekTotal - nextWeekTotal;

  const [currency, setCurrency] = useState("USD");

  const formatAmount = (value = 0, nairaRate = 1550) => {
    const options = {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    };

    const amount = currency === "NGN" ? value * nairaRate : value;
    const formattedAmount = amount.toLocaleString("en-US", options);
    return `${currency === "NGN" ? "₦" : "$"}${formattedAmount}`;
  };

  const goToPreviousWeek = () => {
    setWeekOffset(weekOffset - 1);
  };

  const goToCurrentWeek = () => {
    setWeekOffset(0);
  };

  const goToNextWeek = () => {
    setWeekOffset(weekOffset + 1);
  };

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

  const result = weeklyData?.weekdays;

  const toggleDay = (date) => {
    setExpandedDays({
      ...expandedDays,
      [date]: !expandedDays[date],
    });
  };

  const handleCurrencyToggle = (newCurrency) => {
    setCurrency(newCurrency);
  };

  const formattedStartDate = formatDate(weeklyData?.weekdays[0]?.date);
  const formattedEndDate = formatDate(weeklyData?.weekdays[6]?.date);

  useEffect(() => {
    if (weekOffset === 0) {
      const result =
        generateWeeklyDays(currentUser.weekly_capital, new Date(), [], []) ||
        [];
      setWeeklyData(result);
    }
    if (weekOffset > 0) {
      // For next week, we use the lastWeek data as the starting point
      const nextWeekCapital = weeklyData?.lastWeekFinalCapital;
      const nextWeekDate = new Date();
      nextWeekDate.setDate(nextWeekDate.getDate() + weekOffset * 7);

      const result =
        generateWeeklyDays(nextWeekCapital, nextWeekDate, [], []) || [];
      setWeeklyData(result);
    }

    if (weekOffset < 0) {
      const prevWeekCapital = initialWeeklyCapital - Math.abs(weekOffset) * 100; // Just for demo
      const prevWeekDate = new Date();
      prevWeekDate.setDate(prevWeekDate.getDate() + weekOffset * 7);

      const result =
        generateWeeklyDays(prevWeekCapital, prevWeekDate, [], []) || [];
      setWeeklyData(result);
    }
  }, [weekOffset]);

  const dateRange = `${formattedStartDate} - ${formattedEndDate}`;
  return (
    <Container>
      <Header>
        <Title>
          <BarChart2 size={22} />
        </Title>
        <ToggleContainer>
          <DateSelector>
            <Calendar size={18} />
            <span>{dateRange}</span>
          </DateSelector>

          <CurrencyToggle
            active={currency === "USD"}
            onClick={() => handleCurrencyToggle("USD")}
          >
            USD
          </CurrencyToggle>
          <CurrencyToggle
            active={currency === "NGN"}
            onClick={() => handleCurrencyToggle("NGN")}
          >
            NGN
          </CurrencyToggle>
        </ToggleContainer>
      </Header>
      <Body>
        <div className="one">
          <Top>
            <div className="title">
              <Clock size={20} />
              Daily Outcome
            </div>
            <div>
              <NavigationButtons>
                <NavButton
                  onClick={goToPreviousWeek}
                  disabled={weekOffset === 0}
                >
                  <ChevronLeft size={18} /> Previous Week
                </NavButton>
                {weekOffset !== 0 && (
                  <NavButton onClick={goToCurrentWeek}>Current Week</NavButton>
                )}
                <NavButton onClick={goToNextWeek}>
                  Next Week <ChevronRight size={18} />
                </NavButton>
              </NavigationButtons>
            </div>
          </Top>

          <div className="daily">
            {result?.map((day, index) => {
              const isToday = day.date === new Date();
              const isExpanded = expandedDays[day.date] || false;
              const dayName = new Date(day.date).toLocaleDateString("en-US", {
                weekday: "long",
              });
              const dayChange = (
                (day.finalBalance / day.startingCapital - 1) *
                100
              ).toFixed(2);

              return (
                <DailyCard
                  key={index}
                  day={day}
                  isToday={isToday}
                  toggleDay={toggleDay}
                  dayChange={dayChange}
                  dayName={dayName}
                  isExpanded={isExpanded}
                  formatAmount={formatAmount}
                />
              );
            })}
          </div>
        </div>
        <div className="two">
          {weeklyData && (
            <div
              style={{
                backgroundColor: "#1e1e1e",
                borderRadius: "12px",
                padding: "20px",
                height: "fit-content",
                display: "flex",
                flexDirection: "column",
                gap: "15px",
                width: "100%",
              }}
            >
              <h3 style={{ fontSize: "18px", marginBottom: "10px" }}>
                Weekly Summary
              </h3>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Starting Capital:</span>
                <span>{formatAmount(weeklyData.startingCapital)}</span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Final Balance:</span>
                <span>{formatAmount(weeklyData.lastWeekFinalCapital)}</span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderTop: "1px solid #2c2c2c",
                  paddingTop: "10px",
                }}
              >
                <span>Signal 1 Profit:</span>
                <span style={{ color: "#4ade80" }}>
                  {formatAmount(weeklyData.totalFirstSignalProfit)}
                </span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Signal 2 Profit:</span>
                <span style={{ color: "#4ade80" }}>
                  {formatAmount(weeklyData.totalSecondSignalProfit)}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  backgroundColor: "#232323",
                  padding: "10px",
                  borderRadius: "8px",
                  marginTop: "5px",
                }}
              >
                <span>Total Profit:</span>
                <span style={{ color: "#4ade80", fontWeight: "bold" }}>
                  {formatAmount(weeklyData.totalSignalProfit)}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderTop: "1px solid #2c2c2c",
                  paddingTop: "10px",
                  marginTop: "5px",
                }}
              >
                <span>Deposits:</span>
                <span>
                  {weeklyData.totalDeposits} (
                  {formatAmount(
                    weeklyData.deposits.reduce(
                      (sum, deposit) => sum + deposit.amount,
                      0
                    )
                  )}
                  )
                </span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Withdrawals:</span>
                <span>
                  {weeklyData.totalWithdrawals} (
                  {formatAmount(
                    weeklyData.withdrawals.reduce(
                      (sum, withdrawal) => sum + withdrawal.amount,
                      0
                    )
                  )}
                  )
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  backgroundColor: "#232323",
                  padding: "10px",
                  borderRadius: "8px",
                  marginTop: "10px",
                }}
              >
                <span>Weekly Performance:</span>
                <span
                  style={{
                    color:
                      weeklyData.lastWeekFinalCapital -
                        weeklyData.startingCapital >
                      0
                        ? "#4ade80"
                        : "#ef4444",
                    fontWeight: "bold",
                  }}
                >
                  {(
                    (weeklyData.lastWeekFinalCapital /
                      weeklyData.startingCapital -
                      1) *
                    100
                  ).toFixed(2)}
                  %
                </span>
              </div>
            </div>
          )}
        </div>
      </Body>
    </Container>
  );
};

export default Weekly;
