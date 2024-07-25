// capstone/frontend/src/context/TodoContext.js

import React, { createContext, useReducer, useCallback, useMemo } from "react";
import todoReducer, { initialState, todoActions } from "./TodoReducer";
import api from "../utils/api";

export const TodoContext = createContext();

export const TodoProvider = ({ children }) => {
  const [state, dispatch] = useReducer(todoReducer, initialState);

  const setError = useCallback((error) => {
    dispatch({ type: todoActions.SET_ERROR, payload: error });
  }, []);

  const setTodos = useCallback((todos) => {
    dispatch({ type: todoActions.SET_TODOS, payload: todos });
  }, []);

  const setTodoListName = useCallback((todoListName) => {
    dispatch({ type: todoActions.SET_TODOLISTNAME, payload: todoListName });
  }, []);

  const addTodo = useCallback(
    async (todo) => {
      try {
        const response = await api.post(
          `/todos/${state.todoListName}/todos`,
          todo
        );
        dispatch({ type: todoActions.ADD_TODO, payload: response.data });
      } catch (error) {
        console.error("Error adding todo:", error);
        setError("Failed to add todo. Please try again.");
      }
    },
    [state.todoListName, setError]
  );

  const updateTodo = useCallback(
    async (id, updatedTodo) => {
      try {
        const response = await api.put(
          `/todos/${state.todoListName}/todos/${id}`,
          updatedTodo
        );
        dispatch({
          type: todoActions.UPDATE_TODO,
          payload: { id, updatedTodo: response.data },
        });
      } catch (error) {
        console.error("Error updating todo:", error);
        setError("Failed to update todo. Please try again.");
      }
    },
    [state.todoListName, setError]
  );

  const deleteTodo = useCallback(
    async (id) => {
      try {
        await api.delete(`/todos/${state.todoListName}/todos/${id}`);
        dispatch({ type: todoActions.DELETE_TODO, payload: id });
      } catch (error) {
        console.error("Error deleting todo:", error);
        setError("Failed to delete todo. Please try again.");
      }
    },
    [state.todoListName, setError]
  );

  const completeTodo = useCallback(
    async (id) => {
      try {
        const todoToUpdate = state.todos.find((todo) => todo.id === id);
        if (todoToUpdate) {
          const response = await api.put(
            `/todos/${state.todoListName}/todos/${id}`,
            {
              ...todoToUpdate,
              completed: !todoToUpdate.completed,
            }
          );
          dispatch({
            type: todoActions.UPDATE_TODO,
            payload: { id, updatedTodo: response.data },
          });
        }
      } catch (error) {
        console.error("Error completing todo:", error);
        setError("Failed to update todo status. Please try again.");
      }
    },
    [state.todos, state.todoListName, setError]
  );

  const fetchTodos = useCallback(async () => {
    try {
      if (!state.todoListName) {
        console.error("Todo list name is not set");
        return;
      }
      const response = await api.get(`/todos/${state.todoListName}/todos`);
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
      setError("Failed to fetch todos. Please try again.");
    }
  }, [state.todoListName, setTodos, setError]);

  const contextValue = useMemo(
    () => ({
      ...state,
      setTodos,
      setTodoListName,
      addTodo,
      updateTodo,
      deleteTodo,
      completeTodo,
      fetchTodos,
      setError,
    }),
    [
      state,
      setTodos,
      setTodoListName,
      addTodo,
      updateTodo,
      deleteTodo,
      completeTodo,
      fetchTodos,
      setError,
    ]
  );

  return (
    <TodoContext.Provider value={contextValue}>{children}</TodoContext.Provider>
  );
};