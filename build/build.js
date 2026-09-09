const path = require('path')
const { copyFileSync } = require('fs')
const fs = require('licia/fs')

const pkg = require('../package.json')

delete pkg.scripts
delete pkg.devDependencies

fs.writeFile(
  path.resolve(__dirname, '../dist/package.json'),
  JSON.stringify(pkg, null, 2),
  'utf8',
)

/**
 * Keep the canonical filename for compatibility, add a versioned bundle for
 * direct distribution, and provide a stable CDN entry for rolling releases.
 */
copyFileSync(
  path.resolve(__dirname, '../dist/eruda.js'),
  path.resolve(__dirname, `../dist/eruda-${pkg.version}.js`),
)
copyFileSync(
  path.resolve(__dirname, '../dist/eruda.js'),
  path.resolve(__dirname, '../dist/eruda-latest.js'),
)
