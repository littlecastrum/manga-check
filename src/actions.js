import 'colors';
import prompts from 'prompts';
import  utils, { getLastest } from './utils/index.js';
import  {
	addMangaQuestions,
	checkMangaQuestions
} from './questions.js';

const { storage, all, getProp, safeObj } = utils;

const showUnseen = ({ seen, name, url, lastUpdate }) => {		
	if (!seen) {
		const notification = `\nWatch ${name.red} latests chapter at ${url.blue}\n`;
		console.log(notification);
	};
	return { seen, name, url, lastUpdate }
};

const showUpToDate = () => console.log('\nYou are up to date\n'.yellow);

async function add(mangas) {
	const response = await prompts(addMangaQuestions);
	const safeRes = safeObj(response);
	const maybeManga = await safeRes.chain(getLastest);
	maybeManga
		.map(manga => mangas.concat(manga))
		.map(storage.update);
}

async function update(mangas, defaultFn = showUpToDate) {
	const data = await Promise.all(mangas.map(getLastest));
	const allSeenFalse = all(false)((manga) => manga.chain(getProp('seen')).getOrElse(false));
	allSeenFalse(data).matchWith({
		Nothing: defaultFn,
		Just: ({ value }) => value.map((manga) => manga.map(showUnseen))
	})

	const unwrappedData = data.map(manga => manga.getOrElse(''));

	return await storage.update(unwrappedData);
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
		showUpToDate();
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

export default {
	add,
	update,
	check,
	remove: () => console.log('REMOVE'),
	exit: () => console.log('\nBYE BYE!'.yellow)	
}