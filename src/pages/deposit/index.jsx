import React, { useEffect, useState } from "react";

import styled from "styled-components";
import { getAllDeposits, deleteDeposit } from "../../api/request";
import { useNavigate } from "react-router-dom";
import Modal from "./components/Modal";
import DepositForm from "./components/DepositForm";
import DeleteModal from "./components/DeleteModal";
import { formatDate, formatISODate } from "../../utils";
import AllDeposits from "./components/AllDeposits";

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  .action {
    display: flex;
    gap: 1rem;
  }
`;

const FilterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const DateInputGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const DateInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const InputLabel = styled.label`
  font-size: 0.875rem;
  color: #a0a0a0;
`;

const DateInput = styled.input`
  background: #1a1a1a;
  border: 1px solid #ff980020;
  border-radius: 4px;
  color: white;
  padding: 0.5rem;
  min-width: 150px;
  &:focus {
    outline: none;
    border-color: #ff9800;
  }
`;

const Button = styled.button`
  color: #ff9800;
  padding: 0.5rem 1rem;
  border: none;
  background: #f9f2e71f;
  cursor: pointer;
  border-radius: 0.375rem;
  font-weight: 500;
  border: none;
  font-size: 0.875rem;
  border: 1px solid #ff980020;
  outline: none;
  &:hover {
    background: #cfc6b91f;
  }
`;

const CurrencyToggle = styled.button`
  width: auto;
  color: white;
  outline: none;
  border-radius: 0.375rem;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: opacity 0.2s;
  border: 1px solid #ff980020;
  padding: 0.5rem 1rem;
  background-color: #25262b;

  &:hover {
    background-color: #222222;
    border: 1px solid #ff980040;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Bottom = styled.div``;

const Deposit = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [deposits, setDeposits] = useState([]);
  // const { setUser, user } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDeposit, setSelectedDeposit] = useState(null);

  const fetchDeposits = async () => {
    try {
      const response = await getAllDeposits();
      setDeposits(response.data);
    } catch (error) {
      console.error("Error fetching deposits:", error);
    }
  };

  const handleCreateDeposit = () => {
    setIsModalOpen(true);
  };

  const handleDelete = (deposit) => {
    // console.log("Delete deposit:", deposit);
    // await deleteDeposit(deposit._id);
    setDeleteModalOpen(true);
    setSelectedDeposit(deposit);
  };

  const navigate = useNavigate();

  useEffect(() => {
    fetchDeposits();
  }, []);

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
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
      >
        <DepositForm fetchDeposits={fetchDeposits} />
      </Modal>
      <Header>
        <DeleteModal
          isOpen={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
          }}
          onConfirm={async () => {
            try {
              await deleteDeposit(selectedDeposit._id);
              const clonedDeposits = [...deposits];
              const index = clonedDeposits.findIndex(
                (d) => d._id === selectedDeposit._id
              );
              setDeleteModalOpen(false);
              clonedDeposits.splice(index, 1);
              setDeposits(clonedDeposits);
            } catch (error) {}
          }}
          itemName={selectedDeposit?.amount}
        />
        <FilterSection>
          <DateInputGroup>
            <DateInputWrapper>
              <InputLabel>Start Date</InputLabel>
              <DateInput
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </DateInputWrapper>
            <DateInputWrapper>
              <InputLabel>End Date</InputLabel>
              <DateInput
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </DateInputWrapper>
          </DateInputGroup>
        </FilterSection>
        <div className="action">
          <CurrencyToggle
            onClick={() =>
              setCurrency((prev) => (prev === "USD" ? "NGN" : "USD"))
            }
          >
            Switch to {currency === "USD" ? "NGN" : "USD"}
          </CurrencyToggle>
          <Button onClick={handleCreateDeposit}>Create Deposit</Button>
          <Button onClick={() => navigate("/doubling")}>
            View Deposit Stats
          </Button>
        </div>
      </Header>
      <AllDeposits
        formatISODate={formatISODate}
        deposits={deposits}
        formatValue={formatValue}
        handleDelete={handleDelete}
        currency={currency}
      />
    </div>
  );
};

export default Deposit;
