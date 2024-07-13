// capstone/frontend/src/context/TodoContext.js

import React, { createContext, useReducer, useCallback, useMemo } from "react";
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

  const setError = useCallback((error) => {
    dispatch({ type: "SET_ERROR", payload: error });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: "CLEAR_ERROR" });
  }, []);

  const setLoading = useCallback((isLoading) => {
    dispatch({ type: "SET_LOADING", payload: isLoading });
  }, []);

  const contextValue = useMemo(
    () => ({
      ...state,
      setTodos,
      setTodoListName,
      addTodo,
      updateTodo,
      deleteTodo,
      toggleTodo,
      setError,
      clearError,
      setLoading,
    }),
    [
      state,
      setTodos,
      setTodoListName,
      addTodo,
      updateTodo,
      deleteTodo,
      toggleTodo,
      setError,
      clearError,
      setLoading,
    ]
  );

  return (
    <TodoContext.Provider value={contextValue}>{children}</TodoContext.Provider>
  );
};
