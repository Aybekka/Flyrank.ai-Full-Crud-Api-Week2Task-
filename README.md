# Task API

A small in-memory to-do list API built with Node.js and Express. Supports full
CRUD (Create, Read, Update, Delete) on tasks, with interactive documentation via
Swagger UI.

Data lives only in memory — it resets whenever the server restarts. There's no
database yet; that's next week's topic.

## How to run it

```bash
npm install
node server.js
```

Server runs at **http://localhost:3000** Interactive docs (Swagger UI) at
**http://localhost:3000/docs**

## Endpoints

| Method | Path         | Description                          | Success | Errors   |
| ------ | ------------ | ------------------------------------ | ------- | -------- |
| GET    | `/`          | API description                      | 200     | —        |
| GET    | `/health`    | Health check                         | 200     | —        |
| GET    | `/tasks`     | List all tasks                       | 200     | —        |
| GET    | `/tasks/:id` | Get a single task                    | 200     | 404      |
| POST   | `/tasks`     | Create a task (`{ "title": "..." }`) | 201     | 400      |
| PUT    | `/tasks/:id` | Update `title` and/or `done`         | 200     | 400, 404 |
| DELETE | `/tasks/:id` | Delete a task                        | 204     | 404      |

## Sample request

```
$ curl -i -X POST http://localhost:3000/tasks -H "Content-Type: application/json" -d '{"title":"Buy milk"}'
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8

{"id":4,"title":"Buy milk","done":false}
```

## Swagger UI

`/docs` lists every endpoint as interactive documentation — each one can be
expanded and run directly from the browser with "Try it out."

![Swagger UI screenshot](./swagger-screenshot.png)

## Notes

Restarting the server resets the task list back to the 3 seed tasks — everything
is stored in a plain in-memory array, so nothing persists once the process
stops. That's expected at this stage; a real database (coming next week) is what
fixes it.

## AI vs me (Stage 7 — bonus)

**My prompt:**

> Create a todo-app api: Use node.js+Express as your stack, keep it in-memory
> and no database, and create a swaggerUI for it. Use the CRUD system to
> implement 5 endpoints to it and add required status codes
> (200,201,204,400,404)

**What the AI did better:**

- Used `uuidv4()` for task ids instead of a simple incrementing counter —
  genuinely more collision-proof in general, though overkill for a single
  in-memory server with no other id source. A reasonable "safe default," not a
  necessity here.
- Chose `PATCH` instead of `PUT` for updates. This is actually the more
  textbook-correct HTTP verb, since both versions only update the fields that
  are provided rather than replacing the whole resource — which is exactly what
  `PATCH` means. My `PUT` behaves like a `PATCH` semantically, so the AI's
  naming is arguably more accurate to REST conventions in general, even though
  the assignment spec explicitly asked for `PUT`.

**What it got wrong or quietly ignored:**

- No `.trim()` check on `title` — a title of `"   "` (just whitespace) would
  pass its validation and get saved, while mine explicitly rejects that.
- No type-checking on `completed` at all — sending `"completed": "yes"` would
  silently get stored as a string instead of a boolean, with no 400 returned.
  Mine validates that `done` must actually be a boolean.
- On update, it never checks whether at least one field was sent — an empty `{}`
  body to `PATCH /todos/:id` would just succeed and change nothing, returning
  200, instead of a 400 telling the client they sent nothing useful.
- Error responses use `{"message": ...}` instead of `{"error": ...}` — a small
  but real inconsistency if a client (or the assignment's grading script)
  expects a specific key.

**What my prompt forgot to specify — and what the AI silently decided for me:**

- I never named the resource or its fields, so it picked `/todos` with
  `{id, title, completed, createdAt}` instead of `/tasks` with
  `{id, title, done}` — reasonable, but incompatible with the assignment's exact
  spec.
- I never specified an id format, so it defaulted to UUIDs instead of sequential
  numbers — which also makes manual curl testing more annoying, since you have
  to fetch the list first to get a usable id.
- I never said which verb to use for "update," so it picked `PATCH` over the
  spec's required `PUT`.
- I never gave a path for the docs route, so it used `/api-docs` instead of
  `/docs`.
- I never specified the error body's shape, so it invented its own (`message` vs
  `error`).

**One-sentence note on the rematch:** On a second pass, I'd tighten the prompt
to explicitly name the resource (`/tasks`), the exact field names
(`id: number, title: string, done: boolean`), the verb for updates (`PUT`), the
error key (`error`), and the docs path (`/docs`) — since every real difference
above traced back to something I left unsaid rather than something the AI did
wrong on its own.
