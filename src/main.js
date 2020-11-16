import colors from 'colors';
import prompts from 'prompts';
import { exec } from 'child_process';
import actions from './actions.js';
import { mainChoices } from './questions.js';
import utils, { catchStdout, isURL } from './utils/index.js';
import { CLI_OPTIONS } from './constants/index.js';

const { storage, switchcase } = utils;
global.log = "";

async function interactive(option) {
	if (option === 'exit') process.exit();;
	
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

	exec(script);
	process.exit();
}

async function get() {
	colors.disable();
	const mangas = await storage.load();
	const releaseStdout = catchStdout();
	await actions.update(mangas, () => []);
	const updates = releaseStdout();
	console.log(updates)
	process.exit();
}

async function controller(flag) {
	switchcase(flag)({
		[CLI_OPTIONS.notify]: notify,
		[CLI_OPTIONS.get]: get,
	})(interactive);
}

export default controller;