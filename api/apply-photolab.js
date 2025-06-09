export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const { imageUrl, comboId } = req.body;

  try {
    const response = await fetch("https://prod.api.market/api/v1/capix/photolab/photolab/v2/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "x-magicapi-key": process.env.MAGICAPI_KEY,
      },
      body: new URLSearchParams({
        image_url: imageUrl,
        combo_id: comboId || "22435745",
      }),
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
