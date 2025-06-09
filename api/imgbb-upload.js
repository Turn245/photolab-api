import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');
  const { imageBase64 } = req.body;
  if (!imageBase64) return res.status(400).json({ error: 'Geen base64 image opgegeven' });

  const imgbbResponse = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.IMGBB_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      image: imageBase64.split(',')[1],
    })
  });

  const json = await imgbbResponse.json();
  if (!json.success) return res.status(500).json({ error: 'imgbb upload failed', details: json });

  res.status(200).json({ imageUrl: json.data.url });
}
