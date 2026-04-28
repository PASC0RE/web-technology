import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    const rows = await sql`SELECT * FROM news ORDER BY id DESC`;
    return res.json(rows);
  }
  if (req.method === 'POST') {
    const { title, content } = req.body;
    const rows = await sql`INSERT INTO news (title, content) VALUES (${title}, ${content}) RETURNING *`;
    return res.json(rows[0]);
  }
}
