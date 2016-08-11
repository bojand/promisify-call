import test from 'ava';

import promisifyCall from '../';

function testFn(param, fn) {
  setTimeout(() => {
    if (param.toLowerCase() === 'error') {
      return fn(new Error(param));
    }
    return fn(null, param.toUpperCase());
  }, 50);
}

function uppercase(param, fn) {
  return promisifyCall(this, testFn, ...arguments);
}

test.cb('should properly return success value - callback', t => {
  uppercase('foo', (err, res) => {
    t.ifError(err);
    t.is(res, 'FOO');
    t.end();
  });
});

test.cb('should properly return errpr value - callback', t => {
  uppercase('error', (err, res) => {
    t.truthy(err);
    t.falsy(res);
    t.end();
  });
});

test.cb('should properly return success value - promised using then()', t => {
  uppercase('foo').then(res => {
    t.is(res, 'FOO');
    t.end();
  });
});

test.cb('should properly return errpr value - promised using then()', t => {
  uppercase('error').then(res => {
    t.falsy(res);
  }).catch(err => {
    t.truthy(err);
    t.end();
  });
});

test('should properly return success value - promised', async t => {
  t.plan(1);
  const res = await uppercase('foo');
  t.is(res, 'FOO');
});

test('should properly return errpr value - promised', t => {
  t.throws(uppercase('error'));
});
