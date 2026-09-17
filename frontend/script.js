const fs = require('fs');
let content = fs.readFileSync('src/pages/LogSign.jsx', 'utf8');
content = content.replace(/apiFetch\(\/([a-zA-Z0-9\/-]+),/g, 'apiFetch("/",');
content = content.replace(/navigate\(\/([a-zA-Z0-9\/-]*)\)/g, 'navigate("/")');
fs.writeFileSync('src/pages/LogSign.jsx', content);
