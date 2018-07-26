export interface BrowserFrameTestRunnerOptions {
  hideRunnerUi: boolean;
}
export interface BrowserFrameTestRunnerConfig {
  testUrlBase: string;
  options?: Partial<BrowserFrameTestRunnerOptions>;
}
