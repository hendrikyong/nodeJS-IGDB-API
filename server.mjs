import express from "express";
import fetch from "node-fetch";

const app = express();
const port = 1111;
const clientID = "r3auekm7tcozzfu1pi7xpv2cl7kqzt";

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:3000");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.post("/getGames", async (req, res) => {
  try {
    const accessToken = req.body.accessToken;

    const response = await fetch("https://api.igdb.com/v4/games", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Client-ID": clientID,
        Authorization: `Bearer ${accessToken}`,
      },
      body: "fields name,summary,url,screenshots; limit 30;",
    });

    if (response.ok) {
      const data = await response.json();
      const games = data.map((game) => ({
        name: game.name,
        summary: game.summary,
        url: game.url,
        screenshot: game.screenshots,
      }));
      res.json(games);
    } else {
      console.error("Failed to fetch game data:", response.statusText);
      res.status(response.status).send("Failed to fetch game data");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
