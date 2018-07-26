import './adapter/mocha';
import './adapter/qunit';
import './comm-channel/message';
import './presets';
import './runner/browser-frame';
import './runner/iframe';
import './runner/popup';

export { default as TestClient } from './test-client';
export interface AdapterMap {}
export interface AdapterOptionsMap {}
export interface CommChannelMap {}
export interface CommChannelOptionsMap {}
export interface TestRunnerMap {}
export interface TestRunnerOptionsMap {}
export { Data } from './types';
export { setupQUnitTestFrame } from './test-frame-setup';
