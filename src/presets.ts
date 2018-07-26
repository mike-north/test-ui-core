import {
  AdapterOptionsMap,
  CommChannelOptionsMap,
  TestRunnerConfigMap
} from './index';
import { ExcludePropertiesOfType } from './types';

export type PresetNames = 'qunitInBrowser';
export interface PresetTestFrameworksMap {
  qunitInBrowser: 'qunit';
}
export interface PresetRunnerMap {
  qunitInBrowser: 'iframe';
}
export interface PresetCommChannelMap {
  qunitInBrowser: 'postMessage';
}

interface PresetFor<K extends PresetNames> {
  testFramework: PresetTestFrameworksMap[K];
  commChannel: PresetCommChannelMap[K];
  runner: PresetRunnerMap[K];
}

interface PresetOptionsMap<K extends PresetNames> {
  adapter: AdapterOptionsMap[PresetTestFrameworksMap[K]];
  commChannel: CommChannelOptionsMap[PresetCommChannelMap[K]];
  runner: TestRunnerConfigMap[PresetRunnerMap[K]];
}

export type PresetOptionsFor<K extends PresetNames> = ExcludePropertiesOfType<
  PresetOptionsMap<K>,
  undefined | never
>;

export type Presets = PresetFor<PresetNames>;

export const PRESET_CONFIGS: { [K in PresetNames]: PresetFor<K> } = {
  qunitInBrowser: {
    testFramework: 'qunit',
    runner: 'iframe',
    commChannel: 'postMessage'
  }
};
