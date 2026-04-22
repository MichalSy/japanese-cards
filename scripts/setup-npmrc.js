const fs = require('fs')
const path = require('path')

const secretsPath = path.join(__dirname, '../../secrets.json')
const npmrcPath = path.join(__dirname, '../.npmrc')

const secrets = JSON.parse(fs.readFileSync(secretsPath, 'utf8'))
const token = secrets?.github?.token

if (!token) {
  console.error('Kein GitHub-Token in secrets.json gefunden.')
  console.error('Bitte eintragen: { "github": { "token": "ghp_..." } }')
  process.exit(1)
}

const content = `@michalsy:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${token}
`

fs.writeFileSync(npmrcPath, content)
console.log('.npmrc erstellt.')
