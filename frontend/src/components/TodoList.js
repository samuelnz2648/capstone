// capstone/frontend/src/components/TodoList.js

import React, { memo } from "react";
import PropTypes from "prop-types";
import TodoItem from "./TodoItem";
import { ListGroup } from "react-bootstrap";
import { FixedSizeList as List } from "react-window";

const TodoList = memo(({ todos, updateTodo, deleteTodo, completeTodo }) => {
  const Row = ({ index, style }) => (
    <div style={style}>
      <TodoItem
        todo={todos[index]}
        updateTodo={updateTodo}
        deleteTodo={deleteTodo}
        completeTodo={completeTodo}
      />
    </div>
  );

  return (
    <ListGroup aria-label="Todo list" className="todo-list">
      {todos.length > 0 ? (
        <List height={400} itemCount={todos.length} itemSize={50} width="100%">
          {Row}
        </List>
      ) : (
        <ListGroup.Item>No tasks match the current filter.</ListGroup.Item>
      )}
    </ListGroup>
  );
});

TodoList.propTypes = {
  todos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
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
