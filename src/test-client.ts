import { Subscription } from 'micro-observable';
import CommChannel from './comm-channel';
import { AdapterMap, CommChannelMap, TestRunnerMap } from './index';
import {
  PRESET_CONFIGS,
  PresetNames,
  PresetOptionsFor,
  PresetTestFrameworksMap
} from './presets';
import TestRunner from './runner';
import {
  adapterFactory as adapter,
  commChannelFactory as commChannel,
  testRunnerFactory as testRunner
} from './test-client/factories';
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

export default class TestClient<K extends PresetNames> {
  protected adapter: AdapterMap[PresetTestFrameworksMap[K]];
  protected commChannel: CommChannel<any>;
  protected runner: TestRunner<any>;
  constructor(presetName: K, options: PresetOptionsFor<K>) {
    const preset = PRESET_CONFIGS[presetName];
    this.adapter = adapter(preset.testFramework, (options as any).adapter);
    this.commChannel = commChannel(
      preset.commChannel,
      (options as any).commChannel
    );
    this.runner = testRunner(preset.runner, (options as any).runner);
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
