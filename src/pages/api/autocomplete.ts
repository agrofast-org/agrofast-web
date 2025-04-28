import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    input,
    sessiontoken,
    lat,
    lng,
    radius,
    strictbounds,
    components,
    language = "pt-BR",
    types = "geocode",
  } = req.query;

  if (!input) {
    return res.status(400).json({ error: "Parâmetro 'input' é obrigatório" });
  }

  const apiKey = process.env.GOOGLE_MAPS_SERVER_KEY!;

  const params = new URLSearchParams({
    input: input as string,
    key: apiKey,
    types: types as string,
    language: language as string,
  });

  if (sessiontoken) {
    params.append("sessiontoken", sessiontoken as string);
  }

  if (lat && lng) {
    params.append("location", `${lat},${lng}`);
    if (radius) {
      params.append("radius", radius as string);
    }
  }

  if (strictbounds === "true") {
    params.append("strictbounds", "true");
  }

  if (components) {
    params.append("components", `country:${components}`);
  }

  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?${params}`;

  const response = await fetch(url);
  if (!response.ok) {
    return res
      .status(response.status)
      .json({ error: "Erro ao chamar Places Autocomplete" });
  }

  const data = await response.json();

  return res.status(200).json({data, params, url});
};
