import fs from 'fs';
import path from 'path';
import util from 'util';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const filePath = path.join(__dirname, '..', '..', 'db.json');

async function load() {
	const buffer = await readFile(filePath);
	return JSON.parse(buffer.toString('utf-8'));
}

async function update(data) {
	try {
		await writeFile(filePath, JSON.stringify(data), 'utf8');
	} catch(err) {
		console.error(err);
	}
}

export default {
	load,
	update,
}