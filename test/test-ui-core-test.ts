import { TestClient, TestServer } from '@test-ui/core';

QUnit.module('@test-ui/core tests');

QUnit.test('hello', assert => {
  assert.ok(TestClient, 'TestClient exists');
  assert.ok(TestServer, 'TestServer exists');
});
