#!/usr/bin/env node
const fs = require('fs')
const https = require('https')
const path = require('path')

const PROJECT_REF = process.env.SUPABASE_PROJECT_REF || 'pqnfiqczcxnwaenylysb'

function readSecretsToken() {
  const defaultSecrets = fs.existsSync('/home/aiko/secrets.json') ? '/home/aiko/secrets.json' : path.join(process.env.HOME || '/home/aiko', 'secrets.json')
  const secretsPath = process.env.SUPABASE_SECRETS_FILE || defaultSecrets
  const secrets = JSON.parse(fs.readFileSync(secretsPath, 'utf8'))
  for (const nugget of secrets.nuggets || []) {
    if (nugget.name !== 'supabase') continue
    for (const entry of nugget.config || []) {
      if (entry.key === 'SUPABASE_ACCESS_TOKEN') return entry.value
    }
  }
  return null
}

function postQuery(query, token) {
  const body = JSON.stringify({ query })
  const options = {
    method: 'POST',
    hostname: 'api.supabase.com',
    path: `/v1/projects/${PROJECT_REF}/database/query`,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body),
      'User-Agent': 'supabase-cli/1.0 japanese-cards-db-maintenance',
    },
  }

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = ''
      res.setEncoding('utf8')
      res.on('data', chunk => { data += chunk })
      res.on('end', () => {
        if (res.statusCode < 200 || res.statusCode >= 300) {
          const redacted = data
            .replace(/sbp_[A-Za-z0-9_.-]+/g, '<SUPABASE_ACCESS_TOKEN>')
            .replace(/sb_secret_[A-Za-z0-9_.-]+/g, '<SUPABASE_SERVICE_ROLE_KEY>')
          reject(new Error(`Supabase Management API returned ${res.statusCode}: ${redacted.slice(0, 2000)}`))
          return
        }
        resolve(data)
      })
    })
    req.on('error', reject)
    req.write(body)
    req.end()
  })
}

async function main() {
  const sqlFile = process.argv[2]
  if (!sqlFile) {
    console.error('Usage: node scripts/apply-supabase-sql.js <file.sql>')
    process.exit(2)
  }
  const token = process.env.SUPABASE_ACCESS_TOKEN || readSecretsToken()
  if (!token) throw new Error('SUPABASE_ACCESS_TOKEN not found in env or ~/secrets.json nugget supabase')
  const query = fs.readFileSync(sqlFile, 'utf8')
  const started = Date.now()
  const result = await postQuery(query, token)
  const elapsed = ((Date.now() - started) / 1000).toFixed(1)
  let parsed
  try { parsed = JSON.parse(result) } catch { parsed = result }
  const rows = Array.isArray(parsed) ? parsed.length : null
  console.log(JSON.stringify({ ok: true, file: sqlFile, elapsedSeconds: Number(elapsed), resultRows: rows }, null, 2))
}

main().catch(error => {
  console.error(error.message)
  process.exit(1)
})
