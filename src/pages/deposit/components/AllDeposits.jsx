import React from "react";

import styled from "styled-components";

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #a0a0a0;
`;

const Status = styled.span`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: capitalize;

  ${(props) => {
    switch (props.status) {
      case "completed":
        return `
          background: #2e7d32;
          color: #c8e6c9;
        `;
      case "pending":
        return `
          background: #ef6c00;
          color: #ffe0b2;
        `;
      case "failed":
        return `
          background: #c62828;
          color: #ffcdd2;
        `;
      default:
        return "";
    }
  }}
`;

const TradeTime = styled.span`
  text-transform: capitalize;
`;

const Action = styled.button`
  border: 1px solid #dd3e3e;
  color: #dd3e3e;
  cursor: pointer;
  transition: background-color 0.2s;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  background-color: transparent;

  &:hover {
    background-color: #e0313150;
    border: 1px solid transparent;
  }
`;

const Amount = styled.span`
  color: #4caf50;
  font-weight: 500;
`;

const TableContainer = styled.div`
  overflow-x: auto;
  max-height: 28rem;
  border: 1px solid #ff980020;
  border-radius: 8px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 1rem;
  background: #25262b;
  color: #a0a0a0;
  font-weight: 500;
  position: sticky;
  top: 0;
  z-index: 1;
  &:first-child {
    border-top-left-radius: 8px;
  }
  &:last-child {
    border-top-right-radius: 8px;
  }
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #ff980020;
  color: #ffffff;
`;

const tradeTime = {
  0: "Before trade",
  1: "During trade",
  2: "After trade",
};

const AllDeposits = ({
  deposits,
  handleDelete,
  formatValue,
  formatISODate,
  currency,
}) => {
  return (
    <TableContainer>
      <Table>
        <thead>
          <tr>
            <Th>Amount ({currency})</Th>
            <Th>Date</Th>
            <Th>Trade Time</Th>
            <Th>Status</Th>
            <Th>Action</Th>
          </tr>
        </thead>
        <tbody>
          {deposits.length > 0 ? (
            deposits.map((deposit) => (
              <tr key={deposit._id}>
                <Td>
                  <Amount>{formatValue(deposit.amount)}</Amount>
                </Td>
                <Td>{formatISODate(new Date(deposit.date))}</Td>
                <Td>
                  <TradeTime>{tradeTime[deposit?.whenDeposited]}</TradeTime>
                </Td>
                <Td>
                  <Status status={deposit.status || "completed"}>
                    {deposit.status || "completed"}
                  </Status>
                </Td>
                <Td>
                  <Action onClick={() => handleDelete(deposit)}>Delete</Action>
                </Td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">
                <EmptyState>No deposits found</EmptyState>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </TableContainer>
  );
};

export default AllDeposits;
