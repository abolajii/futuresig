import React, { useState } from "react";
import styled from "styled-components";
import ExpenseForm from "./ExpenseForm";
import TagManagement from "./TagManagement";

// Styled Components
const AppContainer = styled.div`
  background-color: #121212;
  color: #e0e0e0;
`;

const Container = styled.div``;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  border-bottom: 1px solid #333;
  padding-bottom: 1rem;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  margin: 0;
  color: #fff;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const Tab = styled.button`
  background-color: ${(props) => (props.active ? "#444" : "#222")};
  color: ${(props) => (props.active ? "#fff" : "#aaa")};
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) => (props.active ? "#444" : "#333")};
  }
`;

const ExpenseList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ExpenseItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #1e1e1e;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid ${(props) => props.borderColor || "#9e9e9e"};
`;

const ExpenseDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const ExpenseName = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
`;

const ExpenseInfo = styled.p`
  margin: 0.25rem 0 0;
  font-size: 0.85rem;
  color: #aaa;
`;

const ExpenseAmount = styled.span`
  font-size: 1.1rem;
  font-weight: 600;
  color: #fff;
`;

const SummaryContainer = styled.div`
  background-color: #1e1e1e;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1.5rem;
`;

const SummaryTitle = styled.h2`
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
  color: #fff;
`;

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  padding-bottom: 0.75rem;
  border-bottom: ${(props) => (props.noBorder ? "none" : "1px solid #333")};
`;

const SummaryLabel = styled.span`
  color: #aaa;
`;

const SummaryValue = styled.span`
  font-weight: 600;
  color: ${(props) => (props.total ? "#fff" : "#ccc")};
`;

// Main Component
const ExpenseApp = () => {
  // Default tag colors
  const [tagColors, setTagColors] = useState({
    personal: "#4caf50",
    debt: "#f44336",
    family: "#2196f3",
    sub: "#ff9800",
  });

  // Sample data structure with default categories
  const [expenses, setExpenses] = useState({
    personal: [
      { name: "Cloth", number: 4, amount: 12000, tag: "personal" },
      { name: "Trouser", number: 4, amount: 12000, tag: "personal" },
      { name: "Shoe", number: 4, amount: 30000, tag: "personal" },
    ],
    debt: [
      { name: "Fair money", amount: 30000, type: "monthly", tag: "debt" },
      { name: "Renmoney", amount: 30000, type: "monthly", tag: "debt" },
      { name: "CredPal", amount: 30000, type: "monthly", tag: "debt" },
    ],
    family: [
      { name: "Kid bro 1", amount: 10000, type: "monthly", tag: "family" },
      { name: "Kid bro 2", amount: 10000, type: "monthly", tag: "family" },
    ],
    sub: [
      { name: "Youtube premium", amount: 1000, type: "monthly", tag: "sub" },
      { name: "DSTV premium", amount: 30000, type: "monthly", tag: "sub" },
    ],
  });

  const [activeTab, setActiveTab] = useState("all");

  // Handle adding a new expense
  const handleAddExpense = (newExpense) => {
    const { tag } = newExpense;

    // Create the category if it doesn't exist yet
    if (!expenses[tag]) {
      setExpenses((prev) => ({
        ...prev,
        [tag]: [],
      }));
    }

    // Add the expense to the appropriate category
    setExpenses((prev) => ({
      ...prev,
      [tag]: [...prev[tag], newExpense],
    }));
  };

  // Handle adding a new tag/category
  const handleAddTag = (tagId, tagName, tagColor) => {
    // Add the color to the tagColors object
    setTagColors((prev) => ({
      ...prev,
      [tagId]: tagColor,
    }));

    // Create an empty array for the new category in expenses
    setExpenses((prev) => ({
      ...prev,
      [tagId]: [],
    }));
  };

  // Handle deleting a tag/category
  const handleDeleteTag = (tagId) => {
    // Remove the tag from tagColors
    const updatedTagColors = { ...tagColors };
    delete updatedTagColors[tagId];
    setTagColors(updatedTagColors);

    // Remove the category and its expenses
    const updatedExpenses = { ...expenses };
    delete updatedExpenses[tagId];
    setExpenses(updatedExpenses);

    // If the active tab is the deleted tag, switch to 'all'
    if (activeTab === tagId) {
      setActiveTab("all");
    }
  };

  // Calculate totals
  const getTotalByCategory = (category) => {
    return expenses[category]?.reduce((sum, item) => sum + item.amount, 0) || 0;
  };

  const getAllTotal = () => {
    return Object.keys(expenses).reduce(
      (sum, category) => sum + getTotalByCategory(category),
      0
    );
  };

  // Filter expenses based on active tab
  const getFilteredExpenses = () => {
    if (activeTab === "all") {
      return Object.keys(expenses).flatMap((category) =>
        expenses[category].map((expense) => ({
          ...expense,
          borderColor: tagColors[expense.tag],
        }))
      );
    } else {
      return (expenses[activeTab] || []).map((expense) => ({
        ...expense,
        borderColor: tagColors[expense.tag],
      }));
    }
  };

  // Update the ExpenseForm to include custom tags
  const getTagOptions = () => {
    return Object.keys(tagColors).map((tag) => ({
      id: tag,
      name: tag.charAt(0).toUpperCase() + tag.slice(1).replace(/_/g, " "),
    }));
  };

  return (
    <AppContainer>
      <Container>
        <Header>
          <Title>Expense Tracker</Title>
        </Header>

        {/* Tag Management Component */}
        <TagManagement
          onAddTag={handleAddTag}
          onDeleteTag={handleDeleteTag}
          existingTags={tagColors}
        />

        {/* Expense Form with Tags Dropdown */}
        <ExpenseForm
          onAddExpense={handleAddExpense}
          tagOptions={getTagOptions()}
        />

        {/* Tab Navigation */}
        <TabContainer>
          <Tab active={activeTab === "all"} onClick={() => setActiveTab("all")}>
            All
          </Tab>
          {Object.keys(expenses).map((tag) => (
            <Tab
              key={tag}
              active={activeTab === tag}
              onClick={() => setActiveTab(tag)}
              style={{ borderLeft: `4px solid ${tagColors[tag]}` }}
            >
              {tag.charAt(0).toUpperCase() + tag.slice(1).replace(/_/g, " ")}
            </Tab>
          ))}
        </TabContainer>

        {/* Expense List */}
        <ExpenseList>
          {getFilteredExpenses().map((expense, index) => (
            <ExpenseItem key={index} borderColor={expense.borderColor}>
              <ExpenseDetails>
                <ExpenseName>{expense.name}</ExpenseName>
                <ExpenseInfo>
                  {expense.number ? `Quantity: ${expense.number}` : ""}
                  {expense.type ? `Type: ${expense.type}` : ""}
                  <span
                    style={{
                      marginLeft:
                        expense.number && expense.type ? "0.5rem" : "0",
                    }}
                  >
                    Category:{" "}
                    {expense.tag.charAt(0).toUpperCase() +
                      expense.tag.slice(1).replace(/_/g, " ")}
                  </span>
                </ExpenseInfo>
              </ExpenseDetails>
              <ExpenseAmount>₦{expense.amount.toLocaleString()}</ExpenseAmount>
            </ExpenseItem>
          ))}
          {getFilteredExpenses().length === 0 && (
            <ExpenseItem style={{ justifyContent: "center", color: "#888" }}>
              No expenses in this category
            </ExpenseItem>
          )}
        </ExpenseList>

        {/* Summary Section */}
        <SummaryContainer>
          <SummaryTitle>Summary</SummaryTitle>
          {Object.keys(expenses).map((category, index) => (
            <SummaryItem
              key={category}
              noBorder={index === Object.keys(expenses).length - 1}
              style={{
                borderLeft: `4px solid ${tagColors[category]}`,
                paddingLeft: "0.5rem",
              }}
            >
              <SummaryLabel>
                {category.charAt(0).toUpperCase() +
                  category.slice(1).replace(/_/g, " ")}
              </SummaryLabel>
              <SummaryValue>
                ₦{getTotalByCategory(category).toLocaleString()}
              </SummaryValue>
            </SummaryItem>
          ))}
          <SummaryItem style={{ marginTop: "1rem" }}>
            <SummaryLabel
              style={{ fontWeight: 600, fontSize: "1.1rem", color: "#fff" }}
            >
              TOTAL
            </SummaryLabel>
            <SummaryValue total>₦{getAllTotal().toLocaleString()}</SummaryValue>
          </SummaryItem>
        </SummaryContainer>
      </Container>
    </AppContainer>
  );
};

export default ExpenseApp;
