import { suite, test } from 'qunit-decorators';
import * as Core from '../src';
import TestClient from '../src/base-client';
import BaseObject from '../src/base-object';
import TestServer from '../src/base-server';
import IFrameConnectionClient from '../src/connection/iframe-client';
import IFrameConnectionServer from '../src/connection/iframe-server';

@suite('@test-ui/core tests')
export class ExportsTest {
  @test
  'default exports are correct'(assert: Assert) {
    assert.deepEqual(
      Object.keys(Core),
      [
        'Client',
        'Server',
        'BaseObject',
        'IFrameConnectionClient',
        'IFrameConnectionServer'
      ],
      'index.ts exports are correct'
    );
  }
  @test
  'TestClient export is correct'(assert: Assert) {
    assert.deepEqual(
     Core.Client, TestClient
    , 'has the correct value');
  }
  @test
  'TestServer export is correct'(assert: Assert) {
    assert.deepEqual(
     Core.Server, TestServer
    , 'has the correct value');
  }
  @test
  'BaseObject export is correct'(assert: Assert) {
    assert.deepEqual(
     Core.BaseObject, BaseObject
    , 'has the correct value');
  }
  @test
  'IFrameConnectionClient export is correct'(assert: Assert) {
    assert.deepEqual(
     Core.IFrameConnectionClient, IFrameConnectionClient
    , 'has the correct value');
  }
  @test
  'IFrameConnectionServer export is correct'(assert: Assert) {
    assert.deepEqual(
     Core.IFrameConnectionServer, IFrameConnectionServer
    , 'has the correct value');
  }
}
