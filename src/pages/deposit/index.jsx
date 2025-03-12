import React from "react";

import styled from "styled-components";
import DepositForm from "./components/DepositForm";
import DepositProgrees from "./components/DepositProgrees";

const Container = styled.div``;

const Deposit = () => {
  return (
    <div>
      <DepositForm />
      <AllDepos />
      <DepositProgrees />
    </div>
  );
};

export default Deposit;
