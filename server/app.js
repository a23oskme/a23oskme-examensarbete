// Load variables from .env
import "dotenv/config";
// Import express (webbserver framework)
import express from "express";
// Import REST implementation
import wikiRestRouter from "./rest/wikiRest.js";
// Import GraphQL implementation
import testTableGraphqlHandler from "./graphql/testTableGraph.js";

// Create express app
const app = express();
// Set which port the server should listen to (from .env)
const port = process.env.PORT;

// Serve frontend from server/public
app.use(express.static("public"));
// use REST router
app.use("/rest", wikiRestRouter);
// use GraphQL handler
app.all("/graphql", testTableGraphqlHandler);

// Starts the server and listen to the port
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});