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

function makePage(row) {
  return {
    page_id: row.page_id,
    page_namespace: row.page_namespace,
    page_title: row.page_title,
    page_is_redirect: row.page_is_redirect,

    categories: async () => {
      const result = await pool.query(
        `
        SELECT c.cat_id, c.cat_title
        FROM categorylinks cl
        JOIN category c ON cl.cl_to = c.cat_id
        WHERE cl.cl_from = $1
        ORDER BY c.cat_id ASC
        `,
        [row.page_id],
      );

      return result.rows.map(makeCategory);
    },
  };
}

function makeCategory(row) {
  return {
    cat_id: row.cat_id,
    cat_title: row.cat_title,

    pages: async () => {
      const result = await pool.query(
        `
        SELECT p.page_id, p.page_namespace, p.page_title, p.page_is_redirect
        FROM categorylinks cl
        JOIN pages p ON cl.cl_from = p.page_id
        WHERE cl.cl_to = $1
        ORDER BY p.page_id ASC
        `,
        [row.cat_id],
      );

      return result.rows.map(makePage);
    },
  };
}

const root = {
  page: async ({ id }) => {
    const result = await pool.query(
      `
      SELECT page_id, page_namespace, page_title, page_is_redirect
      FROM pages
      WHERE page_id = $1
      `,
      [id],
    );

    if (result.rows.length === 0) {
      return null;
    }

    return makePage(result.rows[0]);
  },

  category: async ({ id }) => {
    const result = await pool.query(
      `
      SELECT cat_id, cat_title
      FROM category
      WHERE cat_id = $1
      `,
      [id],
    );

    if (result.rows.length === 0) {
      return null;
    }

    return makeCategory(result.rows[0]);
  },
};

const wikiGraphqlHandler = createHandler({
  schema,
  rootValue: root,
});

export default wikiGraphqlHandler;
