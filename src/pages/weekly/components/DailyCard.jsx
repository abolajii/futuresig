import React from "react";
import {
  Calendar,
  ArrowUp,
  ArrowDown,
  DollarSign,
  BarChart2,
  Activity,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Clock,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Info,
} from "react-feather";

import styled from "styled-components";

const DayCardContainer = styled.div`
  background-color: #1e1e1e;
  border-radius: 12px;
  margin-bottom: 16px;
  overflow: hidden;
  border-left: ${(props) =>
    props.isToday ? "4px solid #4ade80" : "4px solid transparent"};
`;

const DayCardHeader = styled.div`
  padding: 16px 24px;

  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  user-select: none;
  background-color: #242424;
`;

const DayName = styled.span`
  font-weight: 600;
  font-size: 16px;
  color: ${(props) => (props.isToday ? "#4ade80" : "#f8f9fa")};
`;

const DateLabel = styled.span`
  color: #adb5bd;
  font-size: 14px;
`;

const TodayTag = styled.span`
  background-color: #4ade80;
  color: #064e3b;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 16px;
  margin-left: 10px;
`;

const DayCardDate = styled.div`
  display: flex;
  align-items: center;
  /* gap: 12px;  */
`;

const DayCardMetrics = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

const DayMetric = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const MetricValue = styled.span`
  font-weight: 600;
  color: ${(props) =>
    props.positive ? "#4ade80" : props.negative ? "#f87171" : "#f8f9fa"};
`;

const DayCardContent = styled.div`
  padding: ${(props) => (props.isOpen ? "24px" : "0")};
  max-height: ${(props) => (props.isOpen ? "600px" : "0")};
  transition: all 0.3s ease;
  overflow: hidden;
`;

const TradesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
`;

const TradeCard = styled.div`
  background-color: #242424;
  border-radius: 8px;
  padding: 16px;
`;

const TradeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #2c2c2c;
`;

const TradeTitle = styled.h4`
  font-size: 16px;
  font-weight: 500;
  color: #adb5bd;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TradeMetricsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

const TradeMetric = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const TradeMetricLabel = styled.span`
  font-size: 13px;
  color: #6c757d;
`;

const TradeMetricValue = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: ${(props) =>
    props.positive ? "#4ade80" : props.negative ? "#f87171" : "#f8f9fa"};
`;

const TransactionsSection = styled.div`
  margin-top: ${(props) => (props.hasTransactions ? "24px" : "0")};
`;

const TransactionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const TransactionItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${(props) =>
    props.type === "deposit"
      ? "rgba(74, 222, 128, 0.1)"
      : "rgba(248, 113, 113, 0.1)"};
  padding: 12px 16px;
  border-radius: 8px;
  border-left: 4px solid
    ${(props) => (props.type === "deposit" ? "#4ade80" : "#f87171")};
`;

const TransactionInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const TransactionType = styled.span`
  font-weight: 500;
`;

const TransactionAmount = styled.span`
  font-weight: 600;
  color: ${(props) => (props.type === "deposit" ? "#4ade80" : "#f87171")};
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: ${(props) =>
    props.positive
      ? "rgba(74, 222, 128, 0.15)"
      : props.negative
      ? "rgba(248, 113, 113, 0.15)"
      : "rgba(248, 249, 250, 0.1)"};
  color: ${(props) =>
    props.positive ? "#4ade80" : props.negative ? "#f87171" : "#f8f9fa"};
`;

const DataDetailsContainer = styled.div`
  background-color: #1e1e1e;
  border-radius: 12px;
  padding: 24px;
  margin-top: 32px;
`;

const DataDetailsTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #f8f9fa;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

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

const DailyCard = ({
  day,
  isToday,
  toggleDay,
  dayChange,
  isExpanded,
  formatAmount,
}) => {
  console.log(day.deposits);
  return (
    <DayCardContainer isToday={isToday}>
      <DayCardHeader onClick={() => toggleDay(day.date)}>
        <DayCardDate>
          <DayName isToday={isToday}>{formatDate(day?.date)}</DayName>
          {/* <DateLabel>{day.date}</DateLabel> */}
          {isToday && <TodayTag>Today</TodayTag>}
        </DayCardDate>
        <DayCardMetrics>
          <DayMetric>
            <DollarSign size={16} color="#adb5bd" />
            <MetricValue>{formatAmount(day.startingCapital)}</MetricValue>
          </DayMetric>
          <DayMetric>
            <DollarSign size={16} color="#adb5bd" />
            <MetricValue>{formatAmount(day.finalBalance)}</MetricValue>
          </DayMetric>
          <DayMetric>
            <Activity
              size={16}
              color={day.totalProfit > 0 ? "#4ade80" : "#f87171"}
            />
            <MetricValue
              positive={day.totalProfit > 0}
              negative={day.totalProfit < 0}
            >
              {formatAmount(day.totalProfit)}
            </MetricValue>
          </DayMetric>
          <DayMetric>
            {day.totalProfit > 0 ? (
              <ArrowUp size={16} color="#4ade80" />
            ) : (
              <ArrowDown size={16} color="#f87171" />
            )}
            <MetricValue positive={dayChange > 0} negative={dayChange < 0}>
              {Math.abs(dayChange)}%
            </MetricValue>
          </DayMetric>
          {isExpanded ? (
            <ChevronUp size={20} color="#adb5bd" />
          ) : (
            <ChevronDown size={20} color="#adb5bd" />
          )}
        </DayCardMetrics>
      </DayCardHeader>
      <DayCardContent isOpen={isExpanded}>
        <TradesGrid>
          <TradeCard>
            <TradeHeader>
              <TradeTitle>
                <AlertCircle size={16} />
                First Signal
              </TradeTitle>
            </TradeHeader>
            <TradeMetricsGrid>
              <TradeMetric>
                <TradeMetricLabel>Amount</TradeMetricLabel>
                <TradeMetricValue>
                  {formatAmount(day.firstTrade.totalAmount)}
                </TradeMetricValue>
              </TradeMetric>
              <TradeMetric>
                <TradeMetricLabel>Profit</TradeMetricLabel>
                <TradeMetricValue
                  positive={day.firstTrade.profit > 0}
                  negative={day.firstTrade.profit < 0}
                >
                  {formatAmount(day.firstTrade.profit)}
                </TradeMetricValue>
              </TradeMetric>
              <TradeMetric>
                <TradeMetricLabel>Starting Capital</TradeMetricLabel>
                <TradeMetricValue>
                  {formatAmount(day.firstTrade.startingCapital)}
                </TradeMetricValue>
              </TradeMetric>
              <TradeMetric>
                <TradeMetricLabel>Return</TradeMetricLabel>
                <TradeMetricValue
                  positive={day.firstTrade.profit > 0}
                  negative={day.firstTrade.profit < 0}
                >
                  {(
                    (day.firstTrade.profit / day.firstTrade.totalAmount) *
                    100
                  ).toFixed(2)}
                  %
                </TradeMetricValue>
              </TradeMetric>
            </TradeMetricsGrid>
          </TradeCard>

          <TradeCard>
            <TradeHeader>
              <TradeTitle>
                <AlertCircle size={16} />
                Second Signal
              </TradeTitle>
            </TradeHeader>
            <TradeMetricsGrid>
              <TradeMetric>
                <TradeMetricLabel>Amount</TradeMetricLabel>
                <TradeMetricValue>
                  {formatAmount(day.secondTrade.totalAmount)}
                </TradeMetricValue>
              </TradeMetric>
              <TradeMetric>
                <TradeMetricLabel>Profit</TradeMetricLabel>
                <TradeMetricValue
                  positive={day.secondTrade.profit > 0}
                  negative={day.secondTrade.profit < 0}
                >
                  {formatAmount(day.secondTrade.profit)}
                </TradeMetricValue>
              </TradeMetric>
              <TradeMetric>
                <TradeMetricLabel>Final Capital</TradeMetricLabel>
                <TradeMetricValue>
                  {formatAmount(day.secondTrade.capitalAfterTrade)}
                </TradeMetricValue>
              </TradeMetric>
              <TradeMetric>
                <TradeMetricLabel>Return</TradeMetricLabel>
                <TradeMetricValue
                  positive={day.secondTrade.profit > 0}
                  negative={day.secondTrade.profit < 0}
                >
                  {(
                    (day.secondTrade.profit / day.secondTrade.totalAmount) *
                    100
                  ).toFixed(2)}
                  %
                </TradeMetricValue>
              </TradeMetric>
            </TradeMetricsGrid>
          </TradeCard>
        </TradesGrid>
        {(day.deposits.length > 0 || day.withdrawals.length > 0) && (
          <TransactionsSection hasTransactions={true}>
            <TradeTitle style={{ marginBottom: "16px" }}>
              <Activity size={16} /> Transactions
            </TradeTitle>
            <TransactionsList>
              {day.deposits.map((deposit, i) => (
                <TransactionItem key={`deposit-${i}`} type="deposit">
                  <TransactionInfo>
                    <IconContainer positive>
                      <ArrowUp size={16} />
                    </IconContainer>
                    <TransactionType>Deposit</TransactionType>
                  </TransactionInfo>
                  <TransactionAmount type="deposit">
                    +{formatAmount(deposit.amount)}
                  </TransactionAmount>
                </TransactionItem>
              ))}
              {day.withdrawals.map((withdrawal, i) => (
                <TransactionItem key={`withdrawal-${i}`} type="withdrawal">
                  <TransactionInfo>
                    <IconContainer negative>
                      <ArrowDown size={16} />
                    </IconContainer>
                    <TransactionType>Withdrawal</TransactionType>
                  </TransactionInfo>
                  <TransactionAmount type="withdrawal">
                    -{formatAmount(withdrawal.amount)}
                  </TransactionAmount>
                </TransactionItem>
              ))}
            </TransactionsList>
          </TransactionsSection>
        )}
      </DayCardContent>
    </DayCardContainer>
  );
};

export default DailyCard;
