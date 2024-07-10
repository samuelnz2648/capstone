// frontend/src/components/TodoList.js
import React, { memo } from "react";
import PropTypes from "prop-types";
import TodoItem from "./TodoItem";
import { ListGroup } from "react-bootstrap";

const TodoList = memo(({ todos, updateTodo, deleteTodo, completeTodo }) => (
  <ListGroup>
    {todos.length > 0 ? (
      todos.map((todo, index) => (
        <TodoItem
          key={todo.id || index}
          todo={todo}
          index={index}
          updateTodo={updateTodo}
          deleteTodo={deleteTodo}
          completeTodo={completeTodo}
        />
      ))
    ) : (
      <ListGroup.Item>No tasks yet. Add a task to get started!</ListGroup.Item>
    )}
  </ListGroup>
));

TodoList.propTypes = {
  todos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      task: PropTypes.string.isRequired,
      completed: PropTypes.bool.isRequired,
    })
  ).isRequired,
  updateTodo: PropTypes.func.isRequired,
  deleteTodo: PropTypes.func.isRequired,
  completeTodo: PropTypes.func.isRequired,
};

TodoList.displayName = "TodoList";

export default TodoList;
