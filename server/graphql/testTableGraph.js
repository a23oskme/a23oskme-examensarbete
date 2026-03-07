// Import buildSchema from GraphQL to define what types and queries the API should have
import { buildSchema } from "graphql";
// Import createHandler to connect GraphQL to an Express-route
import { createHandler } from "graphql-http/lib/use/express";
// Import database connection
import pool from "../db.js";

// Create GraphQL-schema that describes what types and queries that should be available
// Type: defines TestRow, which represents a row in test_table
// Query: Defines which queries the client can ask the GraphQL-API
    // testTable: [TestRow!]!: gets all rows from test_table, like a list of TestRow-objects
    // testRow(id:ID!): TestRow: Gets a specifik row from test_table based on an id
const schema = buildSchema(`
  type TestRow {
    id: ID!
    name: String
  }

  type Query {
    testTable: [TestRow!]!
    testRow(id: ID!): TestRow
  }
`);

// root-object contains resolvers (functions that are called when a requesting a query)
const root = {
  // Resolver for testTable query that fetches all rows in the table
  testTable: async () => {
    const result = await pool.query("SELECT id, name FROM test_table ORDER BY id ASC");
    return result.rows;
  },
  // Resolver for testRow query ...
  testRow: async ({ id }) => {
    const result = await pool.query(
      "SELECT id, name FROM test_table WHERE id = $1",
      [id]
    );
    return result.rows[0] || null;
  }
};

// Creates a GraphQL-handler that Express can use for the endpoint 
const testTableGraphqlHandler = createHandler({
  // connect the GraphQL-schema to the handler
  schema,
  // connect the root object so that the correct resolver is requested for each query
  rootValue: root
});

// Export handler so that it can be used in app.js
export default testTableGraphqlHandler;