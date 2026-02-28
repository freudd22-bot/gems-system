
const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

const DB_FILE = "database.json";

function readDB() {
    if (!fs.existsSync(DB_FILE)) {
        fs.writeFileSync(DB_FILE, JSON.stringify({ games: {} }));
    }
    return JSON.parse(fs.readFileSync(DB_FILE));
}

function writeDB(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

app.post("/api/charge", (req, res) => {
    const { game, userId, gems } = req.body;

    if (!game || !userId || !gems)
        return res.status(400).json({ error: "بيانات ناقصة" });

    let db = readDB();

    if (!db.games[game]) db.games[game] = {};
    if (!db.games[game][userId]) db.games[game][userId] = { gems: 0 };

    db.games[game][userId].gems += Number(gems);
    writeDB(db);

    res.json({
        message: "تم الشحن بنجاح",
        balance: db.games[game][userId].gems
    });
});

app.get("/api/balance/:game/:userId", (req, res) => {
    let db = readDB();
    const { game, userId } = req.params;

    if (!db.games[game] || !db.games[game][userId])
        return res.json({ balance: 0 });

    res.json({ balance: db.games[game][userId].gems });
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
