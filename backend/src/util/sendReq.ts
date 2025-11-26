type purposeType = "SPECIFIC" | "SEARCH";

export function getYoutubeReq(type: purposeType, param: string) {
  if (type == "SEARCH")
    return `${process.env.YOUTUBE_URL}/search?part=snippet&type=video&q=${param}&key=${process.env.API_KEY}`;
  else
    return `${process.env.YOUTUBE_URL}/videos?part=snippet,contentDetails,statistics&id=${param}&key=${process.env.API_KEY}`;
}

export function generateCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let out = "";
  for (let i = 0; i < 5; i++)
    out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}
