import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    const { category } = req.query;
    const rows = category
      ? await sql`SELECT * FROM news WHERE category=${category} ORDER BY id DESC`
      : await sql`SELECT * FROM news ORDER BY id DESC`;
    return res.json(rows);
  }

  if (req.method === 'POST') {
    const { title, content, category } = req.body;
    const rows = await sql`INSERT INTO news (title, content, category) VALUES (${title}, ${content}, ${category}) RETURNING *`;
    return res.json(rows[0]);
  }
}