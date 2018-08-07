import { AssertionReport, DoneTestDataEvent, RunReport, StartTestDataEvent, SuiteDoneTestDataEvent, SuiteInfo, SuiteReport, SuiteStartTestDataEvent, TestDoneTestDataEvent, TestInfo, TestReport, TestStartTestDataEvent } from './types';

const testInfo: TestInfo = {
  id: '002',
  name: 'A test',
  suiteId: '001'
};
const suiteInfo: SuiteInfo = {
  id: '001',
  name: 'A suite',
  tests: [testInfo]
};

const assertReport: AssertionReport = {
  message: 'The value was ok',
  isPassed: true
};

const testReport: TestReport = {
  id: 'My first test',
  name: 'My first test',
  assertions: [assertReport],
  isPassed: true,
  isSkipped: false,
  suiteId: '001',
  duration: 0
};

const suiteReport: SuiteReport = {
  id: 'My first suite',
  name: 'My first suite',
  tests: [testReport],
  isPassed: true,
  isSkipped: false,
  duration: 0,
  numPassed: 0,
  numFailed: 0
};

const runReport: RunReport = {
  suites: [suiteReport],
  numFailed: 0,
  numPassed: 1,
  isPassed: true,
  isSkipped: false,
  duration: 1
};

const startEvt: StartTestDataEvent = {
  event: 'start',
  info: {
    suites: [suiteInfo]
  }
};
const doneEvt: DoneTestDataEvent = {
  event: 'done',
  info: {
    suites: [suiteInfo]
  },
  report: runReport
};
const suiteStartEvt: SuiteStartTestDataEvent = {
  event: 'suiteStart',
  info: suiteInfo
};
const suiteDoneEvt: SuiteDoneTestDataEvent = {
  event: 'suiteDone',
  info: suiteInfo,
  report: suiteReport
};
const testStartEvt: TestStartTestDataEvent = {
  event: 'testStart',
  info: testInfo
};
const testDoneEvt: TestDoneTestDataEvent = {
  event: 'testDone',
  info: testInfo,
  report: testReport
};

// tslint:disable-next-line:no-unused-expression
[startEvt, doneEvt, suiteStartEvt, suiteDoneEvt, testStartEvt, testDoneEvt];
