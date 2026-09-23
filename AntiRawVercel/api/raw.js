// Anti-Raw cho Roblox loadstring
// Browser / tool vao -> man den, khong thay Lua
// Roblox game:HttpGet vao -> tra ve Lua de loadstring chay
//
// Vi Roblox HttpGet gui User-Agent chua "Roblox" (VD: Roblox/WinInet),
// con trinh duyet gui "Mozilla...", ta dung dau hieu nay de phan biet.

const LUA_CODE = `-- sodiumhub
print("sodiumhub")
`;

const BLACK_PAGE = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title></title><style>html,body{margin:0;height:100%;background:#000}</style></head><body></body></html>`;

module.exports = function handler(req, res) {
  const ua = ((req.headers && req.headers["user-agent"]) || "").toString().toLowerCase();
  const isRoblox = ua.includes("roblox");

  // Khong cho cache de tool kho luu
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("X-Content-Type-Options", "nosniff");

  // Optional: neu set Env RAW_KEY tren Vercel thi bat buoc ?key=...
  // VD: /api/raw?key=sodiumhub123
  const expectedKey = (process.env.RAW_KEY || "").trim();
  if (expectedKey) {
    const gotKey = ((req.query && req.query.key) || "").toString();
    if (gotKey !== expectedKey) {
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      return res.status(200).send(BLACK_PAGE);
    }
  }

  if (isRoblox) {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    return res.status(200).send(LUA_CODE);
  }

  // Moi truong hop khac (browser, curl, python, view-source): chi tra man den
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  return res.status(200).send(BLACK_PAGE);
};
