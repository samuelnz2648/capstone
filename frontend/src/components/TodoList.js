// capstone/frontend/src/components/TodoList.js

import React, { memo, useMemo } from "react";
import PropTypes from "prop-types";
import TodoItem from "./TodoItem";
import { ListGroup } from "react-bootstrap";
import { FixedSizeList as List } from "react-window";

const TodoList = memo(
  ({
    todos,
    updateTodo,
    deleteTodo,
    completeTodo,
    sortBy,
    filterCompleted,
  }) => {
    const filteredAndSortedTodos = useMemo(() => {
      let filteredTodos = todos;

      if (filterCompleted === "completed") {
        filteredTodos = todos.filter((todo) => todo.completed);
      } else if (filterCompleted === "active") {
        filteredTodos = todos.filter((todo) => !todo.completed);
      }

      if (sortBy === "completed") {
        return [...filteredTodos].sort((a, b) =>
          a.completed === b.completed ? 0 : a.completed ? -1 : 1
        );
      }
      return filteredTodos;
    }, [todos, sortBy, filterCompleted]);

    const Row = ({ index, style }) => (
      <div style={style}>
        <TodoItem
          todo={filteredAndSortedTodos[index]}
          index={todos.indexOf(filteredAndSortedTodos[index])}
          updateTodo={updateTodo}
          deleteTodo={deleteTodo}
          completeTodo={completeTodo}
        />
      </div>
    );

    return (
      <ListGroup aria-label="Todo list" className="todo-list">
        {filteredAndSortedTodos.length > 0 ? (
          <List
            height={400}
            itemCount={filteredAndSortedTodos.length}
            itemSize={50}
            width="100%"
          >
            {Row}
          </List>
        ) : (
          <ListGroup.Item>No tasks match the current filter.</ListGroup.Item>
        )}
      </ListGroup>
    );
  }
);

TodoList.propTypes = {
  todos: PropTypes.arrayOf(
    PropTypes.shape({
      task: PropTypes.string.isRequired,
      completed: PropTypes.bool.isRequired,
    })
  ).isRequired,
  updateTodo: PropTypes.func.isRequired,
  deleteTodo: PropTypes.func.isRequired,
  completeTodo: PropTypes.func.isRequired,
  sortBy: PropTypes.string.isRequired,
  filterCompleted: PropTypes.string.isRequired,
};

TodoList.displayName = "TodoList";

export default TodoList;
