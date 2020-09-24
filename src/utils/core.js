import folktale from 'folktale/maybe/index.js';
const { Just, fromNullable, Nothing } = folktale;
/**
 * 
 * @type Object
 * @description Collection of methods for safe handling of objects
 */

export const getProp = prop => obj =>
	typeof obj === 'object' && obj !== null && Reflect.has(obj, prop) 
		? typeof obj[prop] === 'function' ? Just(obj[prop]()) : Just(obj[prop])
		: Nothing();

/**
 * 
 * @type String
 * @description Collection of methods for safe handling of strings
 */

export const safeStrMethod = method => val => str => 
	typeof str === 'string' && Reflect.has(String.prototype, method) 
		? Just(str[method](val)) 
		: Nothing();

export const split = safeStrMethod('split');
export const trim = safeStrMethod('trim')();
export const isSubStr = safeStrMethod('includes')

/**
 * 
 * @type Array
 * @description Collection of methods for safe handling of arrays
 */

export const all = bool => fn => arr => arr.every(fn) === bool ? Just(arr) : Nothing();
export const first = xs => fromNullable(xs[0]);
export const second = xs => fromNullable(xs[1]);