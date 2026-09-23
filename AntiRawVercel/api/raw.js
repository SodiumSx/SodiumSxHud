// Luarmor-style: link gon, anti-get bang 2 stage
// loadstring(game:HttpGet("https://.../api/raw"))()
// /api/raw chi tra LOADER (khong chua source chinh) -> tool lay raw cung chi duoc loader
// Source chinh nam o /api/payload, chi tra khi co secret + hwid + place hop le

const BLACK_PAGE = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title></title><style>html,body{margin:0;height:100%;background:#000}</style></head><body></body></html>`;

const SCRIPT_ID = "sodiumhub_main";
const LOADER_SECRET = (process.env.LOADER_SECRET || "Sx_9f3k_change_me").trim();
// Vi du khoa game: "123456,789012" ; de trong = cho moi game (test)
const ALLOWED_PLACES = (process.env.ALLOWED_PLACES || "").trim();

function getHost(req) {
  const h = (req.headers && (req.headers["x-forwarded-host"] || req.headers.host)) || "sodium-hub-lo.vercel.app";
  return h.toString().split(",")[0].trim();
}

function buildLoader(host) {
  // Loader gon, khong lo source chinh. Tool doc duoc doan nay cung khong co print("sodiumhub").
  return `-- sodium loader
local _s=${JSON.stringify(SCRIPT_ID)}
local _t=${JSON.stringify(LOADER_SECRET)}
local _h=(typeof(gethwid)=="function" and gethwid() or game:GetService("RbxAnalyticsService"):GetClientId())
_h=tostring(_h or "unknown")
local _p=tostring(game.PlaceId)
local _u=${JSON.stringify("https://" + host + "/api/payload")}.."?s=".._s.."&t=".._t.."&hwid=".._h:gsub("[^%w%-%.]", "").."&place=".._p
loadstring(game:HttpGet(_u))()
`;
}

function handler(req, res) {
  const ua = ((req.headers && req.headers["user-agent"]) || "").toString().toLowerCase();
  const isRoblox = ua.includes("roblox");

  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("X-Content-Type-Options", "nosniff");

  // Browser / tool khong gia UA -> man den, khong lo loader
  if (!isRoblox) {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(200).send(BLACK_PAGE);
  }

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  return res.status(200).send(buildLoader(getHost(req)));
}

module.exports = handler;
module.exports.default = handler;
