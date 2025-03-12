import React, { useState } from "react";
import styled from "styled-components";

// Styled Components
const FormContainer = styled.div`
  background-color: #1e1e1e;
  color: #e0e0e0;
  padding: 1.5rem;
  border-radius: 10px;
  font-family: "Inter", sans-serif;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  margin-bottom: 2rem;
`;

const FormTitle = styled.h2`
  font-size: 1.4rem;
  margin: 0 0 1.5rem 0;
  color: #fff;
  border-bottom: 1px solid #333;
  padding-bottom: 0.75rem;
`;

const FormGrid = styled.form`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
`;

const Label = styled.label`
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #aaa;
`;

const Input = styled.input`
  background-color: #2a2a2a;
  color: #fff;
  border: 1px solid #444;
  border-radius: 4px;
  padding: 0.75rem;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: #666;
  }

  &::placeholder {
    color: #666;
  }
`;

const Select = styled.select`
  background-color: #2a2a2a;
  color: #fff;
  border: 1px solid #444;
  border-radius: 4px;
  padding: 0.75rem;
  font-size: 1rem;
  outline: none;
  cursor: pointer;

  option {
    background-color: #2a2a2a;
    color: #fff;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  grid-column: 1 / -1;
  margin-top: 1rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;

  &:hover {
    transform: translateY(-2px);
  }
`;

const SubmitButton = styled(Button)`
  background-color: #4caf50;
  color: #fff;

  &:hover {
    background-color: #43a047;
  }
`;

const CancelButton = styled(Button)`
  background-color: #333;
  color: #ddd;

  &:hover {
    background-color: #444;
  }
`;

// Main Component
const ExpenseForm = ({ onAddExpense, tagOptions = [] }) => {
  const initialFormState = {
    name: "",
    amount: "",
    tag: "personal",
    type: "one-time",
    number: "1",
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Convert strings to appropriate types
    const processedData = {
      ...formData,
      amount: parseFloat(formData.amount) || 0,
      number:
        formData.tag === "personal"
          ? parseInt(formData.number) || 1
          : undefined,
    };

    // Call the parent component function to add the expense
    if (onAddExpense) {
      onAddExpense(processedData);
    }

    // Reset form
    setFormData(initialFormState);

    console.log("Submitted expense:", processedData);
  };

  const handleCancel = () => {
    setFormData(initialFormState);
  };

  // Check if the current tag is the original "personal" tag or a custom personal tag
  const isPersonalType =
    formData.tag === "personal" ||
    tagOptions
      .find((tag) => tag.id === formData.tag)
      ?.name.toLowerCase()
      .includes("personal");

  return (
    <FormContainer>
      <FormTitle>Add New Expense</FormTitle>

      <FormGrid onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="name">Expense Name</Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Groceries, Rent, etc."
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="amount">Amount (₦)</Label>
          <Input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            min="0"
            step="0.01"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="tag">Category</Label>
          <Select
            id="tag"
            name="tag"
            value={formData.tag}
            onChange={handleChange}
            required
          >
            {tagOptions.length > 0 ? (
              tagOptions.map((tag) => (
                <option key={tag.id} value={tag.id}>
                  {tag.name}
                </option>
              ))
            ) : (
              <>
                <option value="personal">Personal</option>
                <option value="debt">Debt</option>
                <option value="family">Family</option>
                <option value="sub">Subscription</option>
              </>
            )}
          </Select>
        </FormGroup>

        {!isPersonalType && (
          <FormGroup>
            <Label htmlFor="type">Payment Type</Label>
            <Select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
              <option value="yearly">Yearly</option>
              <option value="one-time">One-time</option>
            </Select>
          </FormGroup>
        )}

        {isPersonalType && (
          <FormGroup>
            <Label htmlFor="number">Quantity</Label>
            <Input
              type="number"
              id="number"
              name="number"
              value={formData.number}
              onChange={handleChange}
              min="1"
              required
            />
          </FormGroup>
        )}

        <ButtonContainer>
          <CancelButton type="button" onClick={handleCancel}>
            Cancel
          </CancelButton>
          <SubmitButton type="submit">Add Expense</SubmitButton>
        </ButtonContainer>
      </FormGrid>
    </FormContainer>
  );
};

export default ExpenseForm;
