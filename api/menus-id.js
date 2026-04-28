import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // ID-г query-с авна
  const { id } = req.query;

  if (req.method === 'DELETE') {
    await sql`DELETE FROM menus WHERE id = ${id}`;
    return res.json({ ok: true });
  }

  if (req.method === 'PUT') {
    const { name, link } = req.body;
    await sql`UPDATE menus SET name=${name}, link=${link} WHERE id=${id}`;
    return res.json({ ok: true });
  }
}