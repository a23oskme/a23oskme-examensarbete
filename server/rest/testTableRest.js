import express from "express";
import pool from "../db.js";

const router = express.Router();

// This function will run When someone calls GET /api/test-table
router.get("/test-table", async (req, res) => {
  try {
    // SQL query against database through pool
    const result = await pool.query("SELECT id, name FROM test_table ORDER BY id ASC");
    // Return results as JSON to client
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.get("/test-table/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "SELECT id, name FROM test_table WHERE id = $1",
      [id]
    );

    res.json(result.rows[0] || null);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;