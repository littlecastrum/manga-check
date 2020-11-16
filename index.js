#!/usr/bin/env node
import commander from 'commander';
import main from './src/main.js';
import { CLI_OPTIONS } from './src/constants/index.js';


commander.program.version('0.0.1');
commander.program
	.option('-n, --notify', 'notify of latests manga chapters available', CLI_OPTIONS.notify);

commander.program
	.option('-g, --get', 'get json of latests manga chapters available', CLI_OPTIONS.get);
	
commander.program.parse(process.argv);

main(commander.program.notify || commander.program.get);
