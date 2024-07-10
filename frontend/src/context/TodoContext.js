// frontend/src/context/TodoContext.js
import React, { createContext, useReducer, useCallback } from "react";
import todoReducer, { initialState } from "./TodoReducer";

export const TodoContext = createContext();

export const TodoProvider = ({ children }) => {
  const [state, dispatch] = useReducer(todoReducer, initialState);

  const setTodos = useCallback((todos) => {
    dispatch({ type: "SET_TODOS", payload: todos });
  }, []);

  const setTodoListName = useCallback((todoListName) => {
    dispatch({ type: "SET_TODOLISTNAME", payload: todoListName });
  }, []);

  const addTodo = useCallback((todo) => {
    dispatch({ type: "ADD_TODO", payload: todo });
  }, []);

  const updateTodo = useCallback((id, updatedTodo) => {
    dispatch({ type: "UPDATE_TODO", payload: { id, updatedTodo } });
  }, []);

  const deleteTodo = useCallback((id) => {
    dispatch({ type: "DELETE_TODO", payload: id });
  }, []);

  const toggleTodo = useCallback((id) => {
    dispatch({ type: "TOGGLE_TODO", payload: id });
  }, []);

  return (
    <TodoContext.Provider
      value={{
        ...state,
        setTodos,
        setTodoListName,
        addTodo,
        updateTodo,
        deleteTodo,
        toggleTodo,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};
