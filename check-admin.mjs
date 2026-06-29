import bcrypt from 'bcryptjs';
import fs from 'fs';

const file = 'data/runtime/admin-users.json';
const raw = fs.readFileSync(file, 'utf8');
const data = JSON.parse(raw);
console.log('Admin users in file:', data.length);
data.forEach((u, i) => {
  console.log(`  [${i}] email=${u.email} hasHash=${!!u.passwordHash}`);
  if (u.passwordHash) {
    console.log(`      Matches "changeme-admin": ${bcrypt.compareSync('changeme-admin', u.passwordHash)}`);
  }
});