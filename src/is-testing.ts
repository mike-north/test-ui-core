import config from './config';

function isTesting(): boolean {
  config.testFrameIndicators.map(f => f()).map(Boolean);
  const qunitTesting = !!(window && (window as any).QUnit);
  return qunitTesting;
}

export default isTesting;
