import apply from './.internal/apply.js';
import createCtor from './.internal/createCtor.js';
import createHybrid from './.internal/createHybrid.js';
import createRecurry from './.internal/createRecurry.js';
import getHolder from './.internal/getHolder.js';
import replaceHolders from './.internal/replaceHolders.js';
import root from './.internal/root.js';

/**
 * Creates a function that wraps `func` to enable currying.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
 * @param {number} arity The arity of `func`.
 * @returns {Function} Returns the new wrapped function.
 */
function createCurry(func, bitmask, arity) {
  const Ctor = createCtor(func);

  function wrapper(...args) {
    let length = args.length;
    const placeholder = getHolder(wrapper);
    const holders = (length < 3 && args[0] !== placeholder && args[length - 1] !== placeholder)
      ? []
      : replaceHolders(args, placeholder);

    length -= holders.length;
    if (length < arity) {
      return createRecurry(
        func, bitmask, createHybrid, wrapper.placeholder, undefined,
        args, holders, undefined, undefined, arity - length);
    }
    const fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;
    return apply(fn, this, args);
  }
  return wrapper;
}

export default createCurry;