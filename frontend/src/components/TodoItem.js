// capstone/frontend/src/components/TodoItem.js

import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
import { ListGroup, Form, Button, InputGroup } from "react-bootstrap";
import { Pencil, Trash, Check, X } from "react-bootstrap-icons";
import { TodoContext } from "../context/TodoContext";

const TodoItem = ({ todo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(todo.task);
  const { updateTodo, deleteTodo, completeTodo } = useContext(TodoContext);

  const handleUpdate = () => {
    if (editedTask.trim()) {
      updateTodo(todo.id, { task: editedTask.trim() });
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
            onChange={() => completeTodo(todo.id)}
            label={
              <span
                style={{
                  textDecoration: todo.completed ? "line-through" : "none",
                }}
              >
                {todo.task}
              </span>
            }
            id={`todo-${todo.id}`}
          />
          <div>
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="me-2"
              aria-label="Edit todo"
            >
              <Pencil />
            </Button>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => deleteTodo(todo.id)}
              aria-label="Delete todo"
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
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    task: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired,
  }).isRequired,
};

export default React.memo(TodoItem);
