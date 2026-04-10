import { buildSchema } from "graphql";
import { createHandler } from "graphql-http/lib/use/express";
import pool from "../db.js";

const schema = buildSchema(`
  type Page {
    page_id: ID!
    page_namespace: Int
    page_title: String
    page_is_redirect: Int
    categories: [Category!]!
  }

  type Category {
    cat_id: ID!
    cat_title: String
    pages: [Page!]!
  }

  type Query {
    page(id: ID!): Page
    category(id: ID!): Category
  }
`);
export default wikiGraphqlHandler;
