import fetch from 'node-fetch';
import moment from 'moment';
import cheerio from 'cheerio';
import folktale from 'folktale/maybe/index.js';
import { getProp, split, isSubStr, trim, all, first, second } from './core.js';
import storage from './storage.js';
const { Just, Nothing } = folktale;

export function getDateFromHTML(html) {
	const $ = cheerio.load(html);
	
	const alternative = () => Just($('.manga-info-text'))
		.chain(getProp('children'))
		.map(arr => arr.map(getProp('textContent')))
		.map(arr => arr.filter(str => str.chain(isSubStr('Last updated'))))
		.chain(first)
		.getOrElse(Nothing())
		.chain(split(' : '))
		.chain(second)
		.chain(split(' '))
		.chain(first);

	return Just($('span.stre-value'))
		.chain(getProp('first'))
		.chain(getProp('text'))
		.chain(split('-'))
		.chain(first)
		.chain(trim)
		.orElse(alternative)
		.map(date => moment(date, 'LLL'))
	
}

export const isBefore = (thisDate) => (thatDate) => thisDate.isBefore(thatDate, 'day');

export async function getLastest({ name, url, seen, lastUpdate }) {
	if (!seen) return Just({ name, url, seen, lastUpdate });
				
	const response = await fetch(url);
	const html = await response.text();
	const formattedLastUpdate = moment(lastUpdate, 'DD-MM-YYYY');
	const isNewChapter = isBefore(formattedLastUpdate);
	const latests = getDateFromHTML(html)
		.filter(isNewChapter)
		.getOrElse(formattedLastUpdate);

	return Just({
		name,
		url,
		seen: !isNewChapter(latests),
		lastUpdate: latests.format('DD-MM-YYYY')
	});
}

export function catchStdout() {
	const data = [];
	const stdoutWrite = process.stdout.write;
	
	process.stdout.write = ((write) => {
		return function(string) {
			const url = 
				second(string.split('https://'))
					.chain(trim)
					.getOrElse(false);

			if (url) data.push(url);
			
			write.apply(process.stdout, arguments);
		};
	})(process.stdout.write);

	return () => {
		process.stdout.write = stdoutWrite;
		return data;
	}
}

export default {
	getProp,
	split,
	isSubStr,
	trim,
	all,
	first,
	second,
	storage
}
