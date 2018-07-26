import CommChannel from './comm-channel';
import TestRunner from './runner';
import { BrowserFrameTestRunnerOptions } from './runner/browser-frame';

export default abstract class Adapter {
  protected runner!: TestRunner<any>;
  protected commChannel!: CommChannel<any>;
  async setup(runner: TestRunner<any>, commChannel: CommChannel<any>) {
    this.runner = runner;
    this.commChannel = commChannel;
    await this.runner.setup(this);
    await this.commChannel.setup();
  }
  async destroy() {
    await this.runner.destroy();
    await this.commChannel.destroy();
  }
  generateBrowserFrameUrl(
    baseUrl: string,
    opts: Partial<BrowserFrameTestRunnerOptions>
  ): string {
    const urlBase = baseUrl[0] === '/' ? `${window.location.origin}${baseUrl}` : baseUrl;
    let url = new URL(urlBase);
    if (opts.hideRunnerUi) {
      url.searchParams.append('devmode', true as any);
    }
    return url.toString();
  }
}
