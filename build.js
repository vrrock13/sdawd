const fs = require('fs');
const path = require('path');

const root = __dirname;
const outDir = path.join(root, 'build');
const outFile = path.join(outDir, 'last-library.html');

const htmlPath = path.join(root, 'index.html');
const cssPath = path.join(root, 'styles.css');
const jsPath = path.join(root, 'game.js');

const html = fs.readFileSync(htmlPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');
const js = fs.readFileSync(jsPath, 'utf8');

const inlined = html
  .replace('<link rel="stylesheet" href="styles.css" />', `<style>\n${css}\n</style>`)
  .replace('<script src="game.js"></script>', `<script>\n${js}\n</script>`)
  .replace('</body>', `  <!-- built: ${new Date().toISOString()} -->\n  </body>`);

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outFile, inlined, 'utf8');

console.log(`Built: ${outFile}`);
