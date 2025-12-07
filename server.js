import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

app.get("/weeks/:programId", async (req, res) => {
  const { programId } = req.params;
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/Weeks?select=*&program_id=eq.${programId}&order=number.asc`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      }
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/programs/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/Programs?select=*&id=eq.${id}`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      }
    );

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: text });
    }

    const data = await response.json();
    if (data.length === 0) {
      return res.status(404).json({ error: "Program not found" });
    }

    res.json(data[0]); // single()
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/programs", async (req, res) => {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/Programs?select=*`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      }
    );

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: text });
    }

    const data = await response.json();
    res.json(data); // массив всех программ
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
