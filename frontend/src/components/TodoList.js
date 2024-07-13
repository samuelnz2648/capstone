// capstone/frontend/src/components/TodoList.js

import React, { memo, useMemo, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import TodoItem from "./TodoItem";
import { ListGroup } from "react-bootstrap";
import { FixedSizeList as List } from "react-window";

const TodoList = memo(
  ({ todos, updateTodo, deleteTodo, completeTodo, sortBy = "default" }) => {
    const listRef = useRef(null);

    const sortedTodos = useMemo(() => {
      return [...todos].sort((a, b) => {
        if (sortBy === "completed") {
          return a.completed === b.completed ? 0 : a.completed ? 1 : -1;
        }
        return 0;
      });
    }, [todos, sortBy]);

    useEffect(() => {
      const checkScroll = () => {
        if (listRef.current) {
          const list = listRef.current._outerRef;
          const { scrollTop, scrollHeight, clientHeight } = list;
          const isNotAtBottom = scrollTop + clientHeight < scrollHeight - 1;
          list.classList.toggle("show-shadow", isNotAtBottom);
        }
      };

      const list = listRef.current?._outerRef;
      if (list) {
        list.addEventListener("scroll", checkScroll);
        checkScroll(); // Initial check
      }

      return () => {
        if (list) {
          list.removeEventListener("scroll", checkScroll);
        }
      };
    }, [sortedTodos]);

    const Row = ({ index, style }) => (
      <div style={style}>
        <TodoItem
          todo={sortedTodos[index]}
          index={index}
          updateTodo={updateTodo}
          deleteTodo={deleteTodo}
          completeTodo={completeTodo}
        />
      </div>
    );

    return (
      <ListGroup aria-label="Todo list" className="todo-list">
        {sortedTodos.length > 0 ? (
          <List
            ref={listRef}
            height={400}
            itemCount={sortedTodos.length}
            itemSize={50}
            width="100%"
          >
            {Row}
          </List>
        ) : (
          <ListGroup.Item>
            No tasks yet. Add a task to get started!
          </ListGroup.Item>
        )}
      </ListGroup>
    );
  }
);

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
  sortBy: PropTypes.string,
};

TodoList.displayName = "TodoList";

export default TodoList;
