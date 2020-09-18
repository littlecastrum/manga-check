const prompts = require('prompts');
const actions = require('./actions');
const { mainChoices } = require('./questions');
const { storage } = require('./utils');

async function interactive(option) {
	if (option === 4) return;
	
	const mangas = await storage.load();
	const { value } = await prompts(mainChoices);
	await actions[value](mangas);
	interactive(value);
}

async function notify() {
	const mangas = await storage.load();
	await actions.update(mangas);
}

async function controller(isNotify) {
	isNotify 
		? notify()
		: interactive();
}

module.exports = controller;