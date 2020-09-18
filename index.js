#!/usr/bin/env node
const { program } = require('commander');
const main = require('./src/main');
const actions = require('./src/actions');

program.version('0.0.1');
program
	.option('-n, --notify', 'notify of latests manga chapters available', false);
 
program.parse(process.argv);

main(program.notify);
