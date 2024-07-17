// capstone/frontend/src/context/TodoContext.js

import React, { createContext, useReducer, useCallback, useMemo } from "react";
import todoReducer, { initialState } from "./TodoReducer";
import api from "../utils/api";

export const TodoContext = createContext();

export const TodoProvider = ({ children }) => {
  const [state, dispatch] = useReducer(todoReducer, initialState);

  const setTodos = useCallback((todos) => {
    dispatch({ type: "SET_TODOS", payload: todos });
  }, []);

  const setTodoListName = useCallback((todoListName) => {
    dispatch({ type: "SET_TODOLISTNAME", payload: todoListName });
  }, []);

  const addTodo = useCallback(
    async (todo) => {
      try {
        const newTodos = [...state.todos, todo];
        await api.put(`/todos/${state.todoListName}`, { todos: newTodos });
        dispatch({ type: "ADD_TODO", payload: todo });
      } catch (error) {
        console.error("Error adding todo:", error);
      }
    },
    [state.todos, state.todoListName]
  );

  const updateTodo = useCallback(
    async (id, updatedTask) => {
      try {
        const updatedTodos = state.todos.map((todo) =>
          todo.id === id ? { ...todo, task: updatedTask } : todo
        );
        await api.put(`/todos/${state.todoListName}`, { todos: updatedTodos });
        dispatch({
          type: "UPDATE_TODO",
          payload: { id, updatedTodo: { task: updatedTask } },
        });
      } catch (error) {
        console.error("Error updating todo:", error);
      }
    },
    [state.todos, state.todoListName]
  );

  const deleteTodo = useCallback(
    async (id) => {
      try {
        const updatedTodos = state.todos.filter((todo) => todo.id !== id);
        await api.put(`/todos/${state.todoListName}`, { todos: updatedTodos });
        dispatch({ type: "DELETE_TODO", payload: id });
      } catch (error) {
        console.error("Error deleting todo:", error);
      }
    },
    [state.todos, state.todoListName]
  );

  const completeTodo = useCallback(
    async (id) => {
      try {
        const updatedTodos = state.todos.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
        await api.put(`/todos/${state.todoListName}`, { todos: updatedTodos });
        dispatch({ type: "TOGGLE_TODO", payload: id });
      } catch (error) {
        console.error("Error completing todo:", error);
      }
    },
    [state.todos, state.todoListName]
  );

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
      completeTodo,
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
      completeTodo,
      setError,
      clearError,
      setLoading,
    ]
  );

  return (
    <TodoContext.Provider value={contextValue}>{children}</TodoContext.Provider>
  );
};
