import Promise from 'bluebird';

/**
 * Promisifies the call to <code>fn</code> if appropriate given the arguments.
 * Calls the function <code>fn</code> either using callback style if last argument is a function.
 * If last argument is not a function, <code>fn</code> is called returning a promise.
 * This lets you create API that can be called in either fashions.
 * @param  {Object}   ctx  context / this
 * @param  {Function} fn   The function to call
 * @param  {arguments}   args Arguments
 * @return {undefined|*|Promise}  Promise if promisified
 */
function promisifyCall(ctx, fn, ...args) {
  const lastIndex = args.length - 1;
  const lastArg = args && args.length > 0 ? args[lastIndex] : null;
  const cb = typeof lastArg === 'function' ? lastArg : null;

  if (cb) {
    return fn.apply(ctx, args);
  }

  return Promise.fromCallback(callback => {
    args.push(callback);
    fn.apply(ctx, args);
  });
}

module.exports = promisifyCall;
