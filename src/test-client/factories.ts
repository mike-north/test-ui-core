import MochaAdapter from '../adapter/mocha';
import QUnitAdapter from '../adapter/qunit';
import MessageCommChannel from '../comm-channel/message';
import {
  AdapterMap,
  AdapterOptionsMap,
  CommChannelMap,
  CommChannelOptionsMap,
  TestRunnerConfigMap,
  TestRunnerMap
} from '../index';
import { IFrameTestRunner } from '../runner/iframe';
import { PopupTestRunner } from '../runner/popup';

export function adapterFactory<K extends keyof AdapterMap>(
  testFramework: K,
  _options: AdapterOptionsMap[K]
): AdapterMap[K] {
  switch (testFramework) {
    case 'qunit':
      return new QUnitAdapter();
    case 'mocha':
      return new MochaAdapter();
    default:
      throw new Error(`Unknown test framework type: "${testFramework}"`);
  }
}
export function commChannelFactory<K extends keyof CommChannelMap>(
  commChannel: K,
  _options: CommChannelOptionsMap[K]
): CommChannelMap[K] {
  switch (commChannel) {
    case 'postMessage':
      return new MessageCommChannel();
    default:
      throw new Error(`Unknown comm channel type: "${commChannel}"`);
  }
}
export function testRunnerFactory<K extends keyof TestRunnerMap>(
  runner: K,
  cfg: TestRunnerConfigMap[K]
): TestRunnerMap[K] {
  switch (runner) {
    case 'iframe':
      return new IFrameTestRunner(cfg as TestRunnerConfigMap['iframe']);
    case 'popup':
      return new PopupTestRunner(cfg as TestRunnerConfigMap['popup']);
    default:
      throw new Error(`Unknown test runner type: "${runner}"`);
  }
}
