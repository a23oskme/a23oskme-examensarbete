import { buildSchema } from "graphql";
import { createHandler } from "graphql-http/lib/use/express";
import pool from "../db.js";

export default wikiGraphqlHandler;
