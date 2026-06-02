const fs = require('fs');

const p = "C:\\Users\\SAMSUNG\\.gemini\\antigravity\\brain\\db3245b8-b11d-41b4-b54e-8946ce24f1b9\\scratch\\";
function extractArray(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    const start = content.indexOf('[');
    const end = content.lastIndexOf(']');
    if (start !== -1 && end !== -1) {
      let text = content.substring(start + 1, end).trim();
      if (text.endsWith(',')) text = text.slice(0, -1);
      return text;
    }
  } catch (e) {
    console.error("Error reading " + filePath, e);
  }
  return '';
}

const combined = ['kr1', 'kr2', 'gl1', 'gl2'].map(file => extractArray(p + file + '.js')).filter(x => x.length > 0).join(',\n');

const targetFile = "c:\\Users\\SAMSUNG\\Desktop\\wortout\\src\\data\\semiconductorCompanies.js";
let mainContent = fs.readFileSync(targetFile, 'utf-8');

const searchStr = /  \}\r?\n\];/g;
const match = searchStr.exec(mainContent);
if (match) {
  const newContent = mainContent.slice(0, match.index + 3) + ",\n" + combined + "\n];" + mainContent.slice(match.index + match[0].length);
  fs.writeFileSync(targetFile, newContent);
  console.log("Merge Successful!");
} else {
  console.log("Failed to find insertion point");
}
