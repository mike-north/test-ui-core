import Adapter from '../adapter';
import TestRunner from '../runner';
import { BrowserFrameTestRunnerConfig } from './browser-frame';

export class PopupTestRunner extends TestRunner<PopupTestRunnerConfig> {
  constructor(cfg: PopupTestRunnerConfig) {
    super(cfg);
  }
  async setup(adapter: Adapter) {
    let popup = window.open(
      'about:blank',
      '~~TestClientFrame~~',
      'location=no,toolbar=no,width=300,height=200'
    );
    if (!popup) throw new Error('could not open window');
    popup.location.href = adapter.generateBrowserFrameUrl(
      this.cfg.testUrlBase,
      this.cfg.options || {}
    );
  }
}
export interface PopupTestRunnerConfig extends BrowserFrameTestRunnerConfig {}

declare module '@test-ui/client' {
  export interface TestRunnerMap {
    popup: PopupTestRunner;
  }
  export interface TestRunnerConfigMap {
    popup: PopupTestRunnerConfig;
  }
}
