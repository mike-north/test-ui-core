import { TestClient, setupQUnitTestFrame } from '@test-ui/core';

QUnit.module('@test-ui/core tests');

QUnit.test('hello', assert => {
  assert.ok(TestClient, 'TestClient exists');
  assert.ok(setupQUnitTestFrame, 'setupQUnitTestFrame exists');
  assert.equal(typeof setupQUnitTestFrame, 'function', 'setupQUnitTestFrame is a function');
});
