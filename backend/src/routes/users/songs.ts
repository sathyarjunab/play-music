import Router from "express";
import fs, { createReadStream } from "fs";
import path from "path";
import { getYoutubeReq } from "util/sendReq";
import { google, youtube_v3 } from "googleapis";
import Zod from "zod";

const youtube = google.youtube("v3");
type SearchListResponse = youtube_v3.Schema$SearchListResponse;

const route = Router();

// youtube search

// route.get("/search", async (req, res) => {
//   // const { songTitle } = zod
//   //   .object({
//   //     songTitle: zod.string(),
//   //   })
//   //   .parse(req.query);

//   const youtube = google.youtube("v3");

//   const searchResult: youtube_v3.Schema$SearchListResponse = (
//     await youtube.search.list({
//       key: process.env.API_KEY!,
//       part: ["snippet"],
//       q: "Shape of You",
//       maxResults: 5,
//     })
//   ).data;

//   const videoUrl =
//     process.env.YOUTUBE_DOWNLOAD_KEY +
//     `?v=${searchResult.items?.[0].id?.videoId}`;
//   const output = "song.mp3";

//   youtubeDl(videoUrl, {
//     extractAudio: true,
//     audioFormat: "mp3",
//     output: "song.%(ext)s",
//   }).then((output) => {
//     console.log("Downloaded:", output);
//   });

//   res.status(200).send(searchResult);
// });

// route.get("/search_songs", async (req, res) => {
//   try {
//     const { songTitle, language } = Zod.object({
//       songTitle: Zod.string(),
//       language: Zod.string().optional(),
//     }).parse(req.query);

//     // normalize query inputs once
//     const qTitle = songTitle
//       .normalize()
//       .replace(/\s+/g, " ")
//       .trim()
//       .toLowerCase();
//     const qLang = (language ?? "")
//       .normalize()
//       .replace(/\s+/g, " ")
//       .trim()
//       .toLowerCase();

//     const dir = await opendir("./src/songs");
//     const songsLs = new Set<string>();

//     for await (const dirent of dir) {
//       // normalize filename once
//       const raw = dirent.name;
//       const name = raw.normalize().replace(/\s+/g, " ").trim();
//       const lname = name.toLowerCase();

//       // includes checks: title always, language only if provided
//       const titleMatches = lname.includes(qTitle);
//       const langMatches = qLang ? lname.includes(qLang) : true;

//       if (titleMatches || langMatches) songsLs.add(name);
//     }
//     return res.status(200).json({ songs: Array.from(songsLs) });
//   } catch (err) {
//     return res.status(500).json({ error: "internal" });
//   }
// });

// route.get("/getSongs", async (req, res) => {
//   const { songTitle } = Zod.object({
//     songTitle: Zod.string(),
//   }).parse(req.query);

//   const filePath = path.join(__dirname, "../songs", songTitle);

//   try {
//     await fs.promises.access(filePath);
//   } catch (_) {
//     res.status(404).send("not found");
//     return;
//   }

//   const stream = createReadStream(filePath);

//   res.setHeader("Content-Type", "audio/mpeg"); // mp3
//   res.setHeader("Content-Disposition", "inline"); // stream in browser

//   stream.pipe(res);
// });

route.get("/search_songs", async (req, res) => {
  try {
    const { songTitle } = Zod.object({
      songTitle: Zod.string(),
    }).parse(req.query);

    const reqUrl = getYoutubeReq("SEARCH", songTitle);

    // const fetchData = await fetch(reqUrl, {
    //   method: "GET",
    //   headers: {
    //     keys: process.env.API_KEY!,
    //   },
    // });

    // const resp: SearchListResponse = await fetchData.json();

    const dummy = [
      {
        id: { videoId: "udgrClXV26Y" },
        snippet: { title: "Dil Ka Jo Haal Hai (Lyrical)" },
      },
      {
        id: { videoId: "n2dVFdqMYGA" },
        snippet: { title: "Sahiba (Official Music Video)" },
      },
      {
        id: { videoId: "DxsDekHDKXo" },
        snippet: { title: "Aditya Rikhari - Paaro" },
      },
      {
        id: { videoId: "-YlmnPh-6rE" },
        snippet: { title: "For A Reason (Official Video)" },
      },
      {
        id: { videoId: "HP2zqQsrsyg" },
        snippet: { title: "Mann Mera - Official Video" },
      },
    ];

    res.status(200).send(dummy);
  } catch (err) {
    return res.status(500).json({ error: "internal", err });
  }
});

route.get("/getSongs", async (req, res) => {
  const { songTitle } = Zod.object({
    songTitle: Zod.string(),
  }).parse(req.query);

  const filePath = path.join(__dirname, "../songs", songTitle);

  try {
    await fs.promises.access(filePath);
  } catch (_) {
    res.status(404).send("not found");
    return;
  }

  const stream = createReadStream(filePath);

  res.setHeader("Content-Type", "audio/mpeg"); // mp3
  res.setHeader("Content-Disposition", "inline"); // stream in browser

  stream.pipe(res);
});

export default route;
