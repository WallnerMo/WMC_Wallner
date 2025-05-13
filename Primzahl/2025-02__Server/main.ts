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

app.get("/checkprim",  (c) => {
  const num = Number.parseInt(c.req.query("num") || "0");
  if (isNaN(num)) {
    return c.json("Please provide a valid number");
  }
  return c.json({result: isPrime(num)});
});
function isPrime(n: number) {
    if (n < 2) return false;
    for (let i = 2; i * i <= n; i++) {
        if (n % i === 0) return false; /*used instead of square root */
    }
    return true;
}
// serve all other static files
app.get("*", serveStatic({ root: "./static" }));

const port = 8000;

Deno.serve({
  port,
  onListen: () => {
    console.log(`Server running at http://localhost:${port}`);
  },
}, app.fetch);