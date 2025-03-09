import React, { useState } from "react";
import WelcomeUser from "./components/WelcomeUser";
import Stats from "./components/Stats";

import styled from "styled-components";
import Notification from "./components/Notification";
import DailyProfit from "./components/DailyProfit";
import Charts from "./components/Chart";

const FlexContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
`;

const Dashboard = () => {
  const [currency, setCurrency] = useState("USD");
  const [isHidden, setIsHidden] = useState(true);
  const [loading, setLoading] = useState(true);

  const formatValue = (value = 0, nairaRate = 1550) => {
    const options = {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    };

    const amount = currency === "NGN" ? value * nairaRate : value;
    const formattedAmount = amount.toLocaleString("en-US", options);
    return `${currency === "NGN" ? "₦" : "$"}${formattedAmount}`;
  };

  return (
    <div>
      <WelcomeUser
        currency={currency}
        setCurrency={setCurrency}
        isHidden={isHidden}
        setIsHidden={setIsHidden}
      />
      {/* <Notification /> */}
      <Stats isHidden={isHidden} formatValue={formatValue} />
      <FlexContainer>
        <Charts isHidden={loading} />
        <Notification setIsHidden={setLoading} />
      </FlexContainer>
      <DailyProfit formatAmount={formatValue} />
    </div>
  );
};

export default Dashboard;
