const fs = require('fs');
const path = require('path');
const util = require('util');

const readFile = util.promisify(fs.readFile);
const filePath = path.join(__dirname, '..', 'db.json');

const prompts = require('prompts');
const actions = require('./actions');
const { mainChoices } = require('./questions');

async function controller() {
	let response ;
	while (response !== 4) {
		const buffer = await readFile(filePath);
		const mangas = JSON.parse(buffer.toString('utf-8'));
		const { value } = await prompts(mainChoices);
		await actions[value](mangas);
		response = value;
	}
}

module.exports = controller;