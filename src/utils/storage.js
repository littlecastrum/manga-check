const fs = require('fs');
const path = require('path');
const util = require('util');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const filePath = path.join(__dirname, '..', '..', 'db.json');

async function load() {
	const buffer = await readFile(filePath);
	return JSON.parse(buffer.toString('utf-8'));
}

async function update(data) {
	const filePath = path.join(__dirname, '..', 'db.json');
	try {
		await writeFile(filePath, JSON.stringify(data), 'utf8');
	} catch(err) {
		console.error(err);
	}
}

module.exports = {
	load,
	update,
}