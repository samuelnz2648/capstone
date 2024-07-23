// capstone/frontend/src/context/TodoReducer.js

export const initialState = {
  todos: [],
  todoListName: "",
  error: null,
};

export const todoActions = {
  SET_TODOS: "SET_TODOS",
  SET_TODOLISTNAME: "SET_TODOLISTNAME",
  ADD_TODO: "ADD_TODO",
  UPDATE_TODO: "UPDATE_TODO",
  DELETE_TODO: "DELETE_TODO",
  TOGGLE_TODO: "TOGGLE_TODO",
  SET_ERROR: "SET_ERROR",
};

const todoReducer = (state, action) => {
  switch (action.type) {
    case todoActions.SET_TODOS:
      return { ...state, todos: action.payload };
    case todoActions.SET_TODOLISTNAME:
      return { ...state, todoListName: action.payload };
    case todoActions.ADD_TODO:
      return { ...state, todos: [...state.todos, action.payload] };
    case todoActions.UPDATE_TODO:
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload.id
            ? { ...todo, ...action.payload.updatedTodo }
            : todo
        ),
      };
    case todoActions.DELETE_TODO:
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload),
      };
    case todoActions.TOGGLE_TODO:
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo
        ),
      };
    case todoActions.SET_ERROR:
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

export default todoReducer;
