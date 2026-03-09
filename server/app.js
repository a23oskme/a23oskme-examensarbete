// Load variables from .env
import "dotenv/config";
// Import express (webbserver framework)
import express from "express";
// Import node-postgres (pg) which alows Node to communicate with postgresql
import pg from "pg";
// Import REST implementation
import testTableRestRouter from "./rest/testTableRest.js";
// Import GraphQL implementation
import testTableGraphqlHandler from "./graphql/testTableGraph.js";

// Use Pool-class from pb-libary (Pool handles reuse of DB-connections)
const { Pool } = pg;

// Create express app
const app = express();
// Set which port the server should listen to (from .env)
const port = process.env.PORT;

// Serve frontend from server/public
app.use(express.static("public"));
// use REST router
app.use("/rest", testTableRestRouter);
// use GraphQL handler
app.all("/graphql", testTableGraphqlHandler);

// Starts the server and listen to the port
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});