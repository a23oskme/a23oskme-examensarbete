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
      [id]
    );

    res.json(result.rows[0] || null);
  } catch (error) {
    console.error("GET /pages/:id failed:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.get("/categories/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT cat_id, cat_title
      FROM category
      WHERE cat_id = $1
      `,
      [id]
    );

    res.json(result.rows[0] || null);
  } catch (error) {
    console.error("GET /categories/:id failed:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});


export default router;