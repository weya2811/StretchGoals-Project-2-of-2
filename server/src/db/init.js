const fs = require('fs');
const path = require('path');
const db = require('./connection');

const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
db.exec(schema);

console.log('Users table successfully created.')