require('colors');

const prompts = require('prompts');
const { Maybe, getLastest, storage } = require('./utils');
const { addMangaQuestions, checkMangaQuestions } = require('./questions');

const showUnseen = ({ seen, name, url, lastUpdate }) => {		
	if (!seen) {
		const notification = `\nWatch ${name.red} latests chapter at ${url.blue}\n`;
		console.log(notification);
	};
	return { seen, name, url, lastUpdate }
};

async function add(mangas) {
	const response = await prompts(addMangaQuestions);
	const newManga = await getLastest(response);
	const data = [...mangas, newManga];
	return await storage.update(data);
}

async function update(mangas) {
	const data = await Promise.all(mangas.map(getLastest));
	Maybe(data)
		.map(arr => arr.every(({ seen }) => seen) ? null : data)
		.map(arr => arr.map(showUnseen))
		.alt(() => console.log('\nYou are up to date\n'.yellow))
	return await storage.update(data);
}

async function check(mangas) {
	const options = mangas.reduce((acc, { name, seen, url }, idx) => {
		if (!seen) {
			acc.push({
				title: `${name} | ${url}`,
				value: idx
			})
		}
		return acc;
	}, []);

	if (!options.length) {
		console.log('\nYou are up to date\n'.yellow);
		return;
	};
	
	const questions = checkMangaQuestions(options);
	const { seen } = await prompts(questions);

	if (!seen.length) {
		console.log('\nNothing new was seen\n'.yellow);
		return;
	}

	const data = seen.reduce((acc, idx) => {
		acc[idx].seen = true;
		return acc;
	}, mangas);

	return await storage.update(data);
}

module.exports = {
	add,
	update,
	check,
	remove: () => console.log('REMOVE'),
	exit: () => console.log('\nBYE BYE!'.yellow)	
}