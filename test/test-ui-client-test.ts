import hello from 'test-ui-client';

QUnit.module('test-ui-client tests');

QUnit.test('hello', assert => {
  assert.equal(hello(), 'Hello from test-ui-client');
});
