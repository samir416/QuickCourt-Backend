const fs = require('fs');
const file = 'src/main/java/com/quickcourt/quickcourt_backend/service/AuthService.java';
let content = fs.readFileSync(file);
if (content[0] === 0xEF && content[1] === 0xBB && content[2] === 0xBF) {
    fs.writeFileSync(file, content.slice(3));
}
