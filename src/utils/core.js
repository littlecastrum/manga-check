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

export const safeObj = obj =>
	typeof obj === 'object' && Object.keys(obj).length && obj !== null 
		? Just(obj)
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

/**
 * switchcase (fn)
 * @param {any} cases
 * @param {any} defaultCase
 * @param {string | number} key
 */

 export const switchcase = key => cases => defaultCase => {
	const target = Reflect.has(cases, key) ? cases[key] : defaultCase;
	return target instanceof Function ? target() : target;
}
