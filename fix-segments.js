const fs = require('fs');

const targetFile = "c:\\Users\\SAMSUNG\\Desktop\\wortout\\src\\data\\semiconductorCompanies.js";
let mainContent = fs.readFileSync(targetFile, 'utf-8');

// We will regex replace the 'segments: [...]' arrays to make them lowercase and map some common ones.
const validSegments = ['memory', 'foundry', 'fabless', 'idm', 'osat', 'equipment', 'materials', 'eda', 'ip', 'ai-chip'];

mainContent = mainContent.replace(/segments:\s*\[(.*?)\]/g, (match, inner) => {
  let segs = inner.split(',').map(s => s.trim().replace(/['"]/g, '').toLowerCase());
  
  // map aliases
  segs = segs.map(s => {
    if (s === 'material' || s === 'chemicals') return 'materials';
    if (s === 'testing' || s === 'automation' || s === 'metrology' || s === 'inspection' || s === 'cleaning' || s === 'dicing' || s === 'grinding' || s === 'deposition' || s === 'packaging') return 'equipment';
    if (s === 'discrete' || s === 'logic' || s === 'mosfet' || s === 'power' || s === 'analog' || s === 'sensor' || s === 'automotive' || s === 'mcu') return 'idm';
    if (s === 'network' || s === 'rf' || s === 'wireless' || s === 'storage') return 'fabless';
    if (s === 'wafer') return 'materials';
    return s;
  });

  // filter to valid ones
  segs = segs.filter(s => validSegments.includes(s));
  // remove duplicates
  segs = [...new Set(segs)];
  
  // fallback if empty
  if (segs.length === 0) segs = ['idm'];

  return `segments: [${segs.map(s => `'${s}'`).join(', ')}]`;
});

fs.writeFileSync(targetFile, mainContent);
console.log("Fix Successful!");
