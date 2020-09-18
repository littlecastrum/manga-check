const colors = require('colors');
const prompts = require('prompts');
const { exec } = require('child_process');
const actions = require('./actions');
const { mainChoices } = require('./questions');
const { storage, catchStdout } = require('./utils');

global.log = "";

async function interactive(option) {
	if (option === 'exit') return;
	
	const mangas = await storage.load();
	const { value } = await prompts(mainChoices);
	await actions[value](mangas);
	return interactive(value);
}

async function notify() {
	colors.disable();
	const mangas = await storage.load();
	const releaseStdout = catchStdout();
	await actions.update(mangas);
	const notification = releaseStdout();
	const title = 'Mangas updated'
	const action = `display notification "${notification}" with title "${title}"`
	const script = `osascript -e '${action}'`
	exec(script)	
}

async function controller(isNotify) {
	isNotify 
		? notify()
		: interactive();
}

module.exports = controller;