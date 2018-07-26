import Adapter from '../adapter';
import TestRunner from '../runner';
import { BrowserFrameTestRunnerConfig } from './browser-frame';

export class IFrameTestRunner extends TestRunner<IFrameTestRunnerConfig> {
  constructor(cfg: IFrameTestRunnerConfig) {
    super(cfg);
  }
  async setup(adapter: Adapter) {
    this.cfg.iframe.src = adapter.generateBrowserFrameUrl(
      this.cfg.testUrlBase,
      this.cfg.options || {}
    );
  }
}

// tslint:disable-next-line:interface-name
export interface IFrameTestRunnerConfig extends BrowserFrameTestRunnerConfig {
  iframe: HTMLIFrameElement;
}

declare module '@test-ui/client' {
  export interface TestRunnerMap {
    iframe: IFrameTestRunner;
  }
  export interface TestRunnerConfigMap {
    iframe: IFrameTestRunnerConfig;
  }
}
