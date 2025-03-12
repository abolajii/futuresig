import React, { useState, useEffect } from "react";
import styled from "styled-components";

// Styled Components
const TagManagementContainer = styled.div`
  background-color: #1e1e1e;
  color: #e0e0e0;
  padding: 1.5rem;
  border-radius: 10px;
  font-family: "Inter", sans-serif;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  margin-bottom: 2rem;
`;

const TagManagementTitle = styled.h2`
  font-size: 1.4rem;
  margin: 0 0 1.5rem 0;
  color: #fff;
  border-bottom: 1px solid #333;
  padding-bottom: 0.75rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TagFormContainer = styled.div`
  display: ${(props) => (props.isVisible ? "block" : "none")};
  margin-bottom: 1.5rem;
`;

const TagForm = styled.form`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
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

const ColorPreview = styled.div`
  width: 100%;
  height: 40px;
  border-radius: 4px;
  background-color: ${(props) => props.color};
  margin-top: 0.5rem;
  border: 1px solid #444;
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

const AddButton = styled(Button)`
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

const ToggleButton = styled(Button)`
  background-color: #2196f3;
  color: #fff;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;

  &:hover {
    background-color: #1e88e5;
  }
`;

const TagsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
`;

const TagItem = styled.div`
  background-color: #2a2a2a;
  border-radius: 6px;
  padding: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-left: 4px solid ${(props) => props.color};
`;

const TagName = styled.span`
  font-weight: 600;
  color: #fff;
`;

const DeleteButton = styled.button`
  background-color: transparent;
  color: #f44336;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #e53935;
  }
`;

// Generate a random color
const generateRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// Main Component
const TagManagement = ({ onAddTag, onDeleteTag, existingTags }) => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [tagName, setTagName] = useState("");
  const [tagColor, setTagColor] = useState(generateRandomColor());
  const [tags, setTags] = useState(
    existingTags || {
      personal: "#4caf50",
      debt: "#f44336",
      family: "#2196f3",
      sub: "#ff9800",
    }
  );

  // Update local tags when existingTags change
  useEffect(() => {
    if (existingTags) {
      setTags(existingTags);
    }
  }, [existingTags]);

  const handleAddTag = (e) => {
    e.preventDefault();

    if (tagName.trim() === "") return;

    // Convert tag name to lowercase and remove spaces for use as an ID
    const tagId = tagName.toLowerCase().replace(/\s+/g, "_");

    // Add new tag
    const updatedTags = {
      ...tags,
      [tagId]: tagColor,
    };

    setTags(updatedTags);

    // Call parent callback if provided
    if (onAddTag) {
      onAddTag(tagId, tagName, tagColor);
    }

    // Reset form
    setTagName("");
    setTagColor(generateRandomColor());
    setIsFormVisible(false);
  };

  const handleDeleteTag = (tagId) => {
    // Don't allow deletion of default tags
    if (["personal", "debt", "family", "sub"].includes(tagId)) {
      return;
    }

    const updatedTags = { ...tags };
    delete updatedTags[tagId];

    setTags(updatedTags);

    // Call parent callback if provided
    if (onDeleteTag) {
      onDeleteTag(tagId);
    }
  };

  const handleRandomColor = () => {
    setTagColor(generateRandomColor());
  };

  return (
    <TagManagementContainer>
      <TagManagementTitle>
        Expense Categories
        <ToggleButton onClick={() => setIsFormVisible(!isFormVisible)}>
          {isFormVisible ? "Cancel" : "Add New Category"}
        </ToggleButton>
      </TagManagementTitle>

      <TagFormContainer isVisible={isFormVisible}>
        <TagForm onSubmit={handleAddTag}>
          <FormGroup>
            <Label htmlFor="tagName">Category Name</Label>
            <Input
              type="text"
              id="tagName"
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
              placeholder="e.g. Shopping, Travel, etc."
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="tagColor">Category Color</Label>
            <Input
              type="color"
              id="tagColor"
              value={tagColor}
              onChange={(e) => setTagColor(e.target.value)}
            />
            <ColorPreview color={tagColor} />
            <Button
              type="button"
              onClick={handleRandomColor}
              style={{
                marginTop: "0.5rem",
                backgroundColor: "#555",
                padding: "0.5rem",
              }}
            >
              Random Color
            </Button>
          </FormGroup>

          <ButtonContainer>
            <AddButton type="submit">Create Category</AddButton>
          </ButtonContainer>
        </TagForm>
      </TagFormContainer>

      <TagsList>
        {Object.entries(tags).map(([tagId, color]) => (
          <TagItem key={tagId} color={color}>
            <TagName>{tagId.replace(/_/g, " ")}</TagName>
            {!["personal", "debt", "family", "sub"].includes(tagId) && (
              <DeleteButton onClick={() => handleDeleteTag(tagId)}>
                ×
              </DeleteButton>
            )}
          </TagItem>
        ))}
      </TagsList>
    </TagManagementContainer>
  );
};

export default TagManagement;
