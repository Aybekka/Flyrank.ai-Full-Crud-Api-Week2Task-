const express = require('express');
const app = express();
const PORT = 3000;
const swaggerUi = require('swagger-ui-express');
const openapiSpec = require('./openapi.json');

app.use(express.json());


app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));

let tasks = [
    { id:1, title: "todo1", done: false },
    { id:2, title: "todo2", done: false },
    { id: 3, title: "todo3", done: true },
];
let nextId = 4;

app.get('/', (req, res)=>{
    res.json({
        name: "Task API",
        version: "1.0",
        endpoints: ["/tasks"],
    });
});
app.get("/health", (req, res) => {
    res.json({
        status: "ok",
    });
});
app.get("/tasks", (req, res) => {
    res.json(tasks)
});
app.get("/tasks/:id", (req, res) => {
    const id = Number(req.params.id);
    const task = tasks.find((t) => t.id === id);

    if (!task) {
        return res.status(404).json({ error: `Task ${id} not found.` });
    }
    res.json(task)
});
app.post("/tasks", (req, res) => {
    const { title } = req.body ?? {};

    if (!title || typeof title !== "string" || title.trim() === "") {
        return res.status(400).json({ error: "Title is required and should be a non-empty string" });
    }
    const newTask = { id: nextId++, title: title.trim(), done: false };
    tasks.push(newTask);
    res.status(201).json(newTask);

});
app.put("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((t) => t.id === id);
  if (!task) return res.status(404).json({ error: `Task ${id} not found` });

  const { title, done } = req.body ?? {};

  if (title === undefined && done === undefined) {
    return res.status(400).json({ error: "provide at least one of: title, done" });
  }
  if (title !== undefined && (typeof title !== "string" || title.trim() === "")) {
    return res.status(400).json({ error: "title must be a non-empty string" });
  }
  if (done !== undefined && typeof done !== "boolean") {
    return res.status(400).json({ error: "done must be a boolean" });
  }

  if (title !== undefined) task.title = title.trim();
  if (done !== undefined) task.done = done;

  res.json(task);
});
app.delete("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return res.status(404).json({ error: `Task ${id} not found` });

  tasks.splice(index, 1);
  res.status(204).send();
});
app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});