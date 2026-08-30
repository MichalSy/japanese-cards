const fs = require('fs')
const { execFileSync } = require('child_process')

const npmrcPath = require('path').join(__dirname, '../.npmrc')

const token = execFileSync(
  '/home/aiko/.local/bin/infisical-secret',
  ['github-packages', 'NPM_TOKEN'],
  { encoding: 'utf8' }
).trim()

if (!token) {
  console.error('Kein NPM_TOKEN im Infisical-Ordner /github-packages gefunden.')
  process.exit(1)
}

const content = `@michalsy:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${token}
`

fs.writeFileSync(npmrcPath, content)
console.log('.npmrc erstellt.')
