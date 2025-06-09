const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  const { imageUrl } = req.body;
  if (!imageUrl || !imageUrl.startsWith('http')) {
    return res.status(400).json({ error: 'Geen geldige imageUrl opgegeven' });
  }

  // Stap 1: stuur naar photolab API
  const photolabRes = await fetch('https://prod.api.market/api/v1/capix/photolab/photolab/v2', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.PHOTOLAB_KEY
    },
    body: JSON.stringify({
      image_url: imageUrl,
      combo_id: '22435745'
    })
  });

  const photolabJson = await photolabRes.json();
  if (!photolabRes.ok) {
    return res.status(500).json({ error: 'photolab failed', details: photolabJson });
  }

  const requestId = photolabJson.request_id;
  await new Promise(resolve => setTimeout(resolve, 8000)); // wacht 8 sec

  // Stap 2: resultaat ophalen
  const resultRes = await fetch('https://prod.api.market/api/v1/capix/photolab/result/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.PHOTOLAB_KEY
    },
    body: JSON.stringify({ request_id: requestId })
  });

  const resultJson = await resultRes.json();
  if (!resultRes.ok) {
    return res.status(500).json({ error: 'result fetch failed', details: resultJson });
  }

  res.status(200).json({ cartoonUrl: resultJson.image_url });
}
