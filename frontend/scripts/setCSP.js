const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, `../.env.${process.env.NODE_ENV}`) });

const backendURL = process.env.REACT_APP_BASE_URL || "http://localhost:4000";
const socketURL = process.env.REACT_APP_SOCKET_URL || "ws://localhost:4000";

const isProduction = process.env.NODE_ENV === "production";

const cspMeta = `
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https://res.cloudinary.com;
  connect-src 'self' ${backendURL} ${socketURL} https://res.cloudinary.com;
">
`;

const indexPath = path.join(__dirname, "../public/index.html");

let html = fs.readFileSync(indexPath, "utf8");

if (html.includes("Content-Security-Policy")) {
  html = html.replace(
    /<meta http-equiv="Content-Security-Policy"[\s\S]*?>/,
    cspMeta.trim()
  );
} else {
  html = html.replace("<head>", `<head>\n  ${cspMeta.trim()}`);
}

fs.writeFileSync(indexPath, html, "utf8");

console.log(`✅ CSP updated for ${isProduction ? "production" : "development"} mode`);
console.log(`   → Backend: ${backendURL}`);
console.log(`   → Socket: ${socketURL}`);
