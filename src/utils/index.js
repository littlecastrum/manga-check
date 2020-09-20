const fetch = require('node-fetch');
const moment = require('moment');
const cheerio = require('cheerio');
const { Just, Nothing } = require('folktale/maybe');
const { getProp, split, isSubStr, trim, all, first, second } = require('./core');
const storage = require('./storage');

function getDateFromHTML(html) {
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

const isBefore = (thisDate) => (thatDate) => thisDate.isBefore(thatDate, 'day');

async function getLastest({ name, url, seen, lastUpdate }) {
	if (!seen) return { name, url, seen, lastUpdate };
				
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

function catchStdout() {
	let data = '';
	const stdoutWrite = process.stdout.write;
	
	process.stdout.write = ((write) => {
		return function(string) {
			data = string;
			write.apply(process.stdout, arguments);
		};
	})(process.stdout.write);

	return () => {
		process.stdout.write = stdoutWrite;
		return data;
	}
}

module.exports = {
	getLastest,
	storage,
	catchStdout,
	getProp,
	split,
	isSubStr,
	trim,
	all,
	first,
	second
}