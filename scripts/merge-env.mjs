import crypto from 'node:crypto';
import fs from 'node:fs';

const EXAMPLE_PATH = '.env.example';
const LOCAL_PATH = '.env.local';
const VERCEL_PATH = process.argv[2] || '.env.vercel.tmp';

function parseEnv(content) {
  const values = {};

  for (const line of content.split('\n')) {
    if (!line || line.startsWith('#') || !line.includes('=')) {
      continue;
    }

    const index = line.indexOf('=');
    const key = line.slice(0, index).trim();
    const value = line.slice(index + 1);
    values[key] = value;
  }

  return values;
}

function serializeEnv(template, values) {
  return template
    .split('\n')
    .map((line) => {
      if (!line || line.startsWith('#') || !line.includes('=')) {
        return line;
      }

      const key = line.slice(0, line.indexOf('=')).trim();
      if (values[key] !== undefined && values[key] !== '') {
        return `${key}=${values[key]}`;
      }

      return line;
    })
    .join('\n');
}

const example = fs.readFileSync(EXAMPLE_PATH, 'utf8');
const merged = parseEnv(example);

if (fs.existsSync(VERCEL_PATH)) {
  Object.assign(merged, parseEnv(fs.readFileSync(VERCEL_PATH, 'utf8')));
}

if (fs.existsSync(LOCAL_PATH)) {
  Object.assign(merged, parseEnv(fs.readFileSync(LOCAL_PATH, 'utf8')));
}

if (!merged.SESSION_SECRET || merged.SESSION_SECRET.includes('CHANGE_ME')) {
  merged.SESSION_SECRET = crypto.randomBytes(32).toString('hex');
}

if (!merged.ADMIN_PASSWORD || merged.ADMIN_PASSWORD.includes('CHANGE_ME')) {
  merged.ADMIN_PASSWORD = 'admin12345';
}

let output = serializeEnv(example, merged);

for (const [key, value] of Object.entries(merged)) {
  if (!output.includes(`${key}=`)) {
    output += `\n${key}=${value}`;
  }
}

fs.writeFileSync(LOCAL_PATH, `${output}\n`);

if (fs.existsSync(VERCEL_PATH)) {
  fs.unlinkSync(VERCEL_PATH);
}

const blobReady = Boolean(
  merged.BLOB_READ_WRITE_TOKEN ||
    (merged.BLOB_STORE_ID && merged.VERCEL_OIDC_TOKEN),
);

console.log(`Wrote ${LOCAL_PATH}`);
console.log(`Blob storage ready: ${blobReady ? 'yes' : 'no'}`);

if (!blobReady) {
  console.log('Run: npm run env:pull (after linking to Vercel)');
}
