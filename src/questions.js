require('colors');

const OPTIONS = {
	add: {
		title: 'Add new manga',
		value: 'add'
	},
	update: {
		title: 'Update to latests',
		value: 'update'
	},
	check: {
		title: 'Check unseen mangas',
		value: 'check'
	},
	remove: {
		title: 'Remove manga from collection',
		value: 'remove'
	},
	exit: {
		title: 'Exit program',
		value: 'exit'
	}
}

const extractChoices = (acc, {title, value}) => [...acc, { title, value }];

const mainChoices = {
	type: 'select',
	name: 'value',
	message: 'Options',
	choices: Object.values(OPTIONS).reduce(extractChoices, []),
	initial: 0
};

const addMangaQuestions = [
	{
		type: 'text',
		name: 'name',
		message: 'What is the manga name?'
	},
	{
		type: 'text',
		name: 'url',
		message: 'Which is the manga url?'
	},
	{
		type: 'confirm',
		name: 'seen',
		message: 'Have you seen the latest chapter?',
		initial: true
	}
];

const checkMangaQuestions = (choices) => ({
	type: 'multiselect',
	name: 'seen',
	instructions: false,
	message: 'Have you seen any of the last chapters of these mangas?',
	choices,
	hint: '- Space to select. Return to submit'
});

module.exports = {
	mainChoices,
	addMangaQuestions,
	checkMangaQuestions
}