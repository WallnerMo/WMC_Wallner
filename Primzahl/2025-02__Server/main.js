import { Hono } from "hono";
import { serveStatic } from "hono/deno";


const student = {
  name: "John",
  age: 30,
};

const app = new Hono();

// serve index.html
app.get("/", serveStatic({ path: "./static/index.html" })); 

app.get("/student", async (c) => {
  return await c.json(student);
});

// serve all other static files
app.get("*", serveStatic({ root: "./static" }));

Deno.serve(app.fetch);
