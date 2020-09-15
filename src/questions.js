require('colors');

const OPTIONS = {
	add: 'Add new manga',
	update: 'Update to latests',
	check: 'Check unseen mangas',
	remove: 'Remove manga from collection',
	close: 'Close program'
}

const mainChoices = {
	type: 'select',
	name: 'value',
	message: 'Options',
	choices: [
		{ title: OPTIONS.add, value: 0 },
		{ title: OPTIONS.update, value: 1 },
		{ title: OPTIONS.check, value: 2 },
		{ title: OPTIONS.remove, value: 3 },
		{ title: OPTIONS.close, value: 4 }
	],
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