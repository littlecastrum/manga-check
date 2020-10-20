import colors from 'colors';
import prompts from 'prompts';
import { exec } from 'child_process';
import actions from './actions.js';
import { mainChoices } from './questions.js';
import utils, { catchStdout, isURL } from './utils/index.js';

const { storage } = utils;
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
	const updates = releaseStdout();
	const notification = updates.length > 1
		? 'there are several updates'
		: isURL(updates[0]) 
			? 'click to check' 
			: updates[0];
	const title = `-title 'Manga Tracker'`;
	const subtitle = `-subtitle 'Checked for updates'`;
	const message = `-message '${notification}'`;
	const open = isURL(updates[0]) ? `-open ${updates[0]}` : '';
	const sound = `-sound 'Submarine'`
	const script = `terminal-notifier ${title} ${subtitle} ${sound} ${message} ${open}`;

	exec(script)	
}

async function controller(isNotify) {
	isNotify 
		? notify()
		: interactive();
}

export default controller;