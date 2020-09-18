const fetch = require('node-fetch');
const moment = require('moment');
const { JSDOM } = require("jsdom");
const Maybe = require('./maybe');
const storage = require('./storage');

function getDocument(html) {
	const dom = new JSDOM(html);
	const { window: { document } } = dom;
	return document;
}

function getDateFromHTML(document) {
	const alternative = (document) => Maybe(document)
		.map(doc => doc.querySelector('.manga-info-text'))
		.map(elem => elem.children)
		.map(collection => Array.from(collection))
		.map(arr => arr.filter(elem => elem.textContent.includes('Last updated')))
		.map(arr => arr[0])
		.map(elem => elem.textContent)
		.map(str => str.split(' : '))
		.map(arr => arr[1])
		.map(str => str.split(' '))
		.fold(arr => arr[0]);

	return Maybe(document)
		.map(doc => doc.querySelector('.stre-value'))
		.map(elem => elem.textContent)
		.map(str => str.split('-'))
		.map(arr => arr[0])
		.map(str => str.trim())
		.or(alternative(document));
}

async function getLastest({ name, url, seen, lastUpdate }) {
	if (!seen) return { name, url, seen, lastUpdate };
				
	const response = await fetch(url);
	const html = await response.text();
	const document = getDocument(html);
	const maybeDateStr = getDateFromHTML(document);
	
	if (maybeDateStr.isNothing()) return;

	const latests = maybeDateStr.fold(date => moment(date, 'LLL'));
	const formattedLastUpdate = moment(lastUpdate, 'DD-MM-YYYY');
	const isNewChapter = formattedLastUpdate.isBefore(latests, 'day');
	const newLast = !lastUpdate || isNewChapter ? latests : formattedLastUpdate;
	
	return {
		name,
		url,
		seen: !isNewChapter,
		lastUpdate: newLast.format('DD-MM-YYYY')
	};
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
	getDocument,
	getLastest,
	storage,
	Maybe,
	catchStdout
}