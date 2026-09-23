// Stage 2: chua source chinh. Chi tra khi loader goi dung tham so.
// Tool fetch truc tiep /api/payload ma thieu secret/hwid -> khong bao gio thay source.

const BLACK_PAGE = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title></title><style>html,body{margin:0;height:100%;background:#000}</style></head><body></body></html>`;

const LUA_CODE = `-- sodiumhub
print("sodiumhub")
`;

const SCRIPT_ID = "sodiumhub_main";
const LOADER_SECRET = (process.env.LOADER_SECRET || "Sx_9f3k_change_me").trim();
const ALLOWED_PLACES = (process.env.ALLOWED_PLACES || "").trim();

function handler(req, res) {
  const ua = ((req.headers && req.headers["user-agent"]) || "").toString().toLowerCase();
  const isRoblox = ua.includes("roblox");

  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("X-Content-Type-Options", "nosniff");

  const q = req.query || {};
  const s = (q.s || "").toString();
  const t = (q.t || "").toString();
  const hwid = (q.hwid || "").toString();
  const place = (q.place || "").toString();

  const okParams = s === SCRIPT_ID && t === LOADER_SECRET && hwid.length >= 3 && place.length >= 1;

  // Browser mo truc tiep -> luon man den (khong lo co phai thieu params hay khong)
  if (!isRoblox) {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(200).send(BLACK_PAGE);
  }

  // Roblox nhung sai/thieu params (tool fetch chay, doan URL) -> tra lua bao loi, khong phai source
  if (!okParams) {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    return res.status(200).send(`error("unauthorized [sodium]")`);
  }

  // Khoa game (giong Luarmor lock PlaceId). De trong ALLOWED_PLACES = cho test.
  if (ALLOWED_PLACES) {
    const allowed = ALLOWED_PLACES.split(",").map((x) => x.trim()).filter(Boolean);
    if (!allowed.includes(place)) {
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      return res.status(200).send(`error("wrong game [sodium]")`);
    }
  }

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  return res.status(200).send(LUA_CODE);
}

module.exports = handler;
module.exports.default = handler;
