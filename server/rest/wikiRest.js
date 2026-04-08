import express from "express";
import pool from "../db.js";

const router = express.Router();

// GET /rest/pages/:id
router.get("/pages/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT page_id, page_namespace, page_title, page_is_redirect
      FROM pages
      WHERE page_id = $1
      `,
      [id],
    );

    res.json(result.rows[0] || null);
  } catch (error) {
    console.error("GET /pages/:id failed:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// GET /rest/categories/:id
router.get("/categories/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT cat_id, cat_title
      FROM category
      WHERE cat_id = $1
      `,
      [id],
    );

    res.json(result.rows[0] || null);
  } catch (error) {
    console.error("GET /categories/:id failed:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// GET /rest/pages/:id/categories
router.get("/pages/:id/categories", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT
        c.cat_id,
        c.cat_title
      FROM categorylinks cl
      JOIN category c ON cl.cl_to = c.cat_id
      WHERE cl.cl_from = $1
      ORDER BY c.cat_id ASC
      `,
      [id],
    );

    res.json(result.rows);
  } catch (error) {
    console.error("GET /pages/:id/categories failed:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// GET /rest/categories/:id/pages
router.get("/categories/:id/pages", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT
        p.page_id,
        p.page_namespace,
        p.page_title,
        p.page_is_redirect
      FROM categorylinks cl
      JOIN pages p ON cl.cl_from = p.page_id
      WHERE cl.cl_to = $1
      ORDER BY p.page_id ASC
      `,
      [id],
    );

    res.json(result.rows);
  } catch (error) {
    console.error("GET /categories/:id/pages failed:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;