import axios from "axios";

export default async function handler(req, res) {
  const { image_url } = req.body;

  try {
    const start = await axios.post(
      "https://api.magicapi.dev/api/v1/capix/photolab/photolab/v2/",
      {
        image_url,
        combo_id: "22435745"
      },
      {
        headers: {
          "x-magicapi-key": process.env.MAGICAPI_KEY,
          "Content-Type": "application/json"
        }
      }
    );

    const request_id = start.data.request_id;

    let finalImage;
    for (let i = 0; i < 10; i++) {
      await new Promise(r => setTimeout(r, 2000));
      const result = await axios.post(
        "https://api.magicapi.dev/api/v1/capix/photolab/result/",
        { request_id },
        {
          headers: {
            "x-magicapi-key": process.env.MAGICAPI_KEY,
            "Content-Type": "application/json"
          }
        }
      );

      if (result.data.status === "completed") {
        finalImage = result.data.image_url;
        break;
      }
    }

    if (finalImage) {
      res.status(200).json({ success: true, image_url: finalImage });
    } else {
      res.status(408).json({ success: false, message: "Timeout" });
    }
  } catch (err
