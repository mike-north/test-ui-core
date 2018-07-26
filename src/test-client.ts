import { Subscription } from 'micro-observable';
import MochaAdapter from './adapter/mocha';
import QUnitAdapter from './adapter/qunit';
import CommChannel from './comm-channel';
import MessageCommChannel from './comm-channel/message';
import {
  AdapterMap,
  AdapterOptionsMap,
  CommChannelMap,
  CommChannelOptionsMap,
  TestRunnerConfigMap,
  TestRunnerMap
} from './index';
import { PRESET_CONFIGS, PresetNames, PresetOptionsFor, PresetTestFrameworksMap } from './presets';
import TestRunner from './runner';
import { IFrameTestRunner } from './runner/iframe';
import { PopupTestRunner } from './runner/popup';
import { Data } from './types';

export interface Arg<
  A extends keyof AdapterMap,
  C extends keyof CommChannelMap,
  TR extends keyof TestRunnerMap
> {
  testFramework: A;
  commChannel: C;
  runner: TR;
}

function adapterFactory<K extends keyof AdapterMap>(
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
function commChannelFactory<K extends keyof CommChannelMap>(
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
function testRunnerFactory<K extends keyof TestRunnerMap>(
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

export default class TestClient<K extends PresetNames> {
  protected adapter: AdapterMap[PresetTestFrameworksMap[K]];
  protected commChannel: CommChannel<any>;
  protected runner: TestRunner<any>;
  constructor(presetName: K, options: PresetOptionsFor<K>) {
    const preset = PRESET_CONFIGS[presetName];
    this.adapter = adapterFactory(
      preset.testFramework,
      (options as any).adapter
    );
    this.commChannel = commChannelFactory(
      preset.commChannel,
      (options as any).commChannel
    );
    this.runner = testRunnerFactory(preset.runner, (options as any).runner);
  }

  subscribe(cb: (val: Data) => void): Subscription {
    return this.commChannel.subscribe(cb);
  }

  async setup() {
    await this.adapter.setup(this.runner, this.commChannel);
  }
  async destroy() {
    await this.adapter.destroy();
  }
}
