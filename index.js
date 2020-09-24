#!/usr/bin/env node
import commander from 'commander';
import main from './src/main.js';

commander.program.version('0.0.1');
commander.program
	.option('-n, --notify', 'notify of latests manga chapters available', false);
 
commander.program.parse(process.argv);

main(commander.program.notify);
