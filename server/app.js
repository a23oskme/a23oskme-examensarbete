// Load variables from .env
import "dotenv/config";
// Import express (webbserver framework)
import express from "express";
// Import REST implementation
import wikiRestRouter from "./rest/wikiRest.js";
// Import GraphQL implementation
import wikiGraphqlHandler from "./graphql/wikiGraphQL.js";

// Create express app
const app = express();
// Set which port the server should listen to (from .env)
const port = process.env.PORT;

// Serve frontend from server/public
app.use(express.static("public"));
// use REST router
app.use("/rest", wikiRestRouter);
// use GraphQL handler
app.all("/graphql", wikiGraphqlHandler);

// Starts the server and listen to the port
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});