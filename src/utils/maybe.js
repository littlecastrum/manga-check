const inspect = Symbol.for('nodejs.util.inspect.custom');

const isNullOrUndef = (value) => value === null || typeof value === 'undefined';

const Nothing = {
	isNothing: () => true,
	map: () => Nothing,
	fold: () => Nothing,
	or: value => Maybe(value),
	alt: fn => fn(),
	[inspect]: () => `Nothing`
}

const Just = (value) => ({
	isNothing: () => false,
	map: fn => isNullOrUndef(value) ? Nothing : Just(fn(value)),
	fold: fn => isNullOrUndef(value) ? Nothing : fn(value),
	or: () => Maybe(value),
	alt: () => Maybe(value),
	[inspect]: () => `Just(${value})`
})

const Maybe = (value) => isNullOrUndef(value) ? Nothing : Just(value);

export default Maybe;
