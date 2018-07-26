import { TestClient } from '@test-ui/client';

QUnit.module('test-ui-client tests');

QUnit.test('hello', assert => {
  assert.ok(TestClient, 'TestClient exists');
});
