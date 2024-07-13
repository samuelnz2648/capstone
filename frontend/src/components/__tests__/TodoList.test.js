// capstone/frontend/src/components/__tests__/TodoList.test.js

import React from "react";
import { render } from "@testing-library/react";
import TodoList from "../TodoList";

const mockTodos = [
  { id: 1, task: "Test Todo 1", completed: false },
  { id: 2, task: "Test Todo 2", completed: true },
];

const mockFunctions = {
  updateTodo: jest.fn(),
  deleteTodo: jest.fn(),
  completeTodo: jest.fn(),
};

describe("TodoList", () => {
  it("renders todo items", () => {
    const { getByText } = render(
      <TodoList todos={mockTodos} {...mockFunctions} sortBy="default" />
    );

    expect(getByText("Test Todo 1")).toBeInTheDocument();
    expect(getByText("Test Todo 2")).toBeInTheDocument();
  });

  it("renders empty message when no todos", () => {
    const { getByText } = render(
      <TodoList todos={[]} {...mockFunctions} sortBy="default" />
    );

    expect(
      getByText("No tasks yet. Add a task to get started!")
    ).toBeInTheDocument();
  });
});
