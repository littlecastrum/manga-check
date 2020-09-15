require('colors');

const prompts = require('prompts');
const Maybe = require('./maybe');
const { getLastest, updateStorage } = require('./utils');
const { addMangaQuestions, checkMangaQuestions } = require('./questions');

const showUnseen = ({ seen, name, url, lastUpdate }) => {		
	if (!seen) console.log(`\nWatch ${name.red} latests chapter at ${url.blue}\n`);
	return { seen, name, url, lastUpdate }
};

async function add(mangas) {
	const response = await prompts(addMangaQuestions);
	const newManga = await getLastest(response);
	const data = [...mangas, newManga];
	return await updateStorage(data);
}

async function update(mangas) {
	const data = await Promise.all(mangas.map(getLastest));
	Maybe(data)
		.map(arr => arr.every(({ seen }) => seen) ? null : data)
		.map(arr => arr.map(showUnseen))
		.alt(() => console.log('\nYou are up to date\n'.yellow))
	return await updateStorage(data);
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

	return await updateStorage(data);
}

module.exports = [
	add,
	update,
	check,
	() => console.log('REMOVE'),
	() => console.log('\nBYE BYE!')	
]