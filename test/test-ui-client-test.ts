import { TestClient, setupQUnitTestFrame } from '@test-ui/client';

QUnit.module('test-ui-client tests');

QUnit.test('hello', assert => {
  assert.ok(TestClient, 'TestClient exists');
  assert.ok(setupQUnitTestFrame, 'setupQUnitTestFrame exists');
  assert.equal(typeof setupQUnitTestFrame, 'function', 'setupQUnitTestFrame is a function');
});
