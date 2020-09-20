const { Just, fromNullable, Nothing } = require('folktale/maybe');

/**
 * 
 * @type Object
 * @description Collection of methods for safe handling of objects
 */

const getProp = prop => obj =>
	typeof obj === 'object' && obj !== null && Reflect.has(obj, prop) 
		? typeof obj[prop] === 'function' ? Just(obj[prop]()) : Just(obj[prop])
		: Nothing();

/**
 * 
 * @type String
 * @description Collection of methods for safe handling of strings
 */

const safeStrMethod = method => val => str => 
	typeof str === 'string' && Reflect.has(String.prototype, method) 
		? Just(str[method](val)) 
		: Nothing();

const split = safeStrMethod('split');
const trim = safeStrMethod('trim')();
const isSubStr = safeStrMethod('includes')

/**
 * 
 * @type Array
 * @description Collection of methods for safe handling of arrays
 */

const all = bool => fn => arr => arr.every(fn) === bool ? Just(arr) : Nothing();
const first = xs => fromNullable(xs[0]);
const second = xs => fromNullable(xs[1]);

module.exports = {
	getProp,
	split,
	trim,
	isSubStr,
	all,
	first,
	second
}