import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const id = req.url.split('/').pop();

  if (req.method === 'DELETE') {
    await sql`DELETE FROM news WHERE id = ${id}`;
    return res.json({ ok: true });
  }
  if (req.method === 'PUT') {
    const { title, content } = req.body;
    await sql`UPDATE news SET title=${title}, content=${content} WHERE id=${id}`;
    return res.json({ ok: true });
  }
}
