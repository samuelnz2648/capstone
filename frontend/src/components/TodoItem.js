// frontend/src/components/TodoItem.js
import React, { useState } from "react";
import PropTypes from "prop-types";
import { ListGroup, Form, Button, InputGroup } from "react-bootstrap";
import { Pencil, Trash, Check, X } from "react-bootstrap-icons";

const TodoItem = ({ todo, index, updateTodo, deleteTodo, completeTodo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(todo.task);

  const handleUpdate = () => {
    if (editedTask.trim() !== "") {
      updateTodo(index, editedTask);
      setIsEditing(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleUpdate();
    }
  };

  return (
    <ListGroup.Item
      className="d-flex justify-content-between align-items-center"
      variant={todo.completed ? "success" : ""}
    >
      {isEditing ? (
        <InputGroup>
          <Form.Control
            type="text"
            value={editedTask}
            onChange={(e) => setEditedTask(e.target.value)}
            onKeyPress={handleKeyPress}
            autoFocus
          />
          <Button variant="outline-success" onClick={handleUpdate}>
            <Check />
          </Button>
          <Button variant="outline-danger" onClick={() => setIsEditing(false)}>
            <X />
          </Button>
        </InputGroup>
      ) : (
        <>
          <Form.Check
            type="checkbox"
            checked={todo.completed}
            onChange={() => completeTodo(index)}
            label={
              <span
                style={{
                  textDecoration: todo.completed ? "line-through" : "none",
                }}
              >
                {todo.task}
              </span>
            }
            id={`todo-${index}`}
          />
          <div>
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="me-2"
            >
              <Pencil />
            </Button>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => deleteTodo(index)}
            >
              <Trash />
            </Button>
          </div>
        </>
      )}
    </ListGroup.Item>
  );
};

TodoItem.propTypes = {
  todo: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    task: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
  updateTodo: PropTypes.func.isRequired,
  deleteTodo: PropTypes.func.isRequired,
  completeTodo: PropTypes.func.isRequired,
};

export default React.memo(TodoItem);
