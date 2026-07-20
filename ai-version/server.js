// AI-generated Task API
// Generated from this prompt:
// "Create a todo-app api: Use node.js+Express as your stack, keep it
// in-memory and no database, and create a swaggerUI for it. Use the CRUD
// system to implement 5 endpoints to it and add required status codes
// (200,201,204,400,404)"

const express = require("express");
const swaggerUi = require("swagger-ui-express");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-memory storage
let todos = [
  { id: uuidv4(), title: "Learn Express", completed: false, createdAt: new Date() },
  { id: uuidv4(), title: "Build a REST API", completed: false, createdAt: new Date() },
];

// GET /todos - list all
app.get("/todos", (req, res) => {
  res.status(200).json(todos);
});

// GET /todos/:id - get one
app.get("/todos/:id", (req, res) => {
  const todo = todos.find((t) => t.id === req.params.id);
  if (!todo) {
    return res.status(404).json({ message: "Todo not found" });
  }
  res.status(200).json(todo);
});

// POST /todos - create
app.post("/todos", (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  const newTodo = {
    id: uuidv4(),
    title,
    completed: false,
    createdAt: new Date(),
  };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// PATCH /todos/:id - update
app.patch("/todos/:id", (req, res) => {
  const todo = todos.find((t) => t.id === req.params.id);
  if (!todo) {
    return res.status(404).json({ message: "Todo not found" });
  }

  const { title, completed } = req.body;
  if (title !== undefined) todo.title = title;
  if (completed !== undefined) todo.completed = completed;

  res.status(200).json(todo);
});

// DELETE /todos/:id - delete
app.delete("/todos/:id", (req, res) => {
  const index = todos.findIndex((t) => t.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: "Todo not found" });
  }
  todos.splice(index, 1);
  res.status(204).send();
});

// Swagger setup
const swaggerDocument = {
  openapi: "3.0.0",
  info: { title: "Todo API", version: "1.0.0" },
  paths: {
    "/todos": {
      get: { summary: "Get all todos", responses: { 200: { description: "OK" } } },
      post: { summary: "Create a todo", responses: { 201: { description: "Created" }, 400: { description: "Bad Request" } } },
    },
    "/todos/{id}": {
      get: { summary: "Get a todo by id", responses: { 200: { description: "OK" }, 404: { description: "Not Found" } } },
      patch: { summary: "Update a todo", responses: { 200: { description: "OK" }, 404: { description: "Not Found" } } },
      delete: { summary: "Delete a todo", responses: { 204: { description: "No Content" }, 404: { description: "Not Found" } } },
    },
  },
};

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, () => {
  console.log(`Todo API running on port ${PORT}`);
  console.log(`Swagger docs at http://localhost:${PORT}/api-docs`);
});