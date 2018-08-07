import JSReporters from './js-reporters';
import { RunEndEvent, RunStartEvent, SuiteEndEvent, SuiteInfo, SuiteStartEvent, TestEndEvent, TestInfo, TestStartEvent } from './types';

const testInfo: TestInfo = {
  id: '002',
  name: 'A test',
  fullName: ['A test'],
  suiteName: '001'
};
const suiteInfo: SuiteInfo = {
  id: '001',
  name: 'A suite',
  fullName: ['A suite'],
  tests: [testInfo],
  testCounts: {
    total: 3
  }
};

const assertReport: JSReporters.Assertion<number> = {
  message: 'The value was ok',
  passed: true,
  todo: false,
  actual: 124,
  expected: 124
};
const assertReport2: JSReporters.Assertion<string> = {
  message: 'The value was ok',
  passed: false,
  todo: false,
  actual: '123',
  expected: '124'
};

const testStart: JSReporters.TestStart = {
  name: 'test2',
  suiteName: 'suite2',
  fullName: ['suite1', 'suite2', 'test2']
};

const testEnd: JSReporters.TestEnd = {
  name: 'test2',
  suiteName: 'suite2',
  fullName: ['suite1', 'suite2', 'test2'],
  status: `passed`,
  runtime: 1,
  errors: [],
  assertions: [{
    passed: true,
    todo: false,
    actual: true,
    expected: true,
    message: `some message`,
    stack: undefined
  }]
};

const suiteEnd: JSReporters.SuiteEnd = {
  name: 'suite1',
  fullName: ['suite1'],
  tests: [testInfo],
  childSuites: [],
  status: `failed`,
  testCounts: {
    todo: 0,
    passed: 1,
    failed: 1,
    skipped: 0,
    total: 2
  },
  runtime: 3
};
const suiteStart: JSReporters.SuiteStart = {
  name: 'suite2',
  fullName: ['suite1', 'suite2'],
  tests: [testInfo],
  childSuites: [],
  testCounts: {
    total: 1
  }
};

const suiteStartEvt: SuiteStartEvent = {
  event: 'suiteStart',
  data: suiteStart
};
const suiteDoneEvt: SuiteEndEvent = {
  event: 'suiteEnd',
  data: suiteEnd
};
const startEvt: RunStartEvent = {
  event: 'runStart',
  data: suiteStart
};
const doneEvt: RunEndEvent = {
  event: 'runEnd',
  data: suiteEnd
};
const testStartEvt: TestStartEvent = {
  event: 'testStart',
  data: testStart
};
const testDoneEvt: TestEndEvent = {
  event: 'testEnd',
  data: testEnd
};

// tslint:disable-next-line:no-unused-expression
[startEvt, doneEvt, suiteStartEvt, suiteDoneEvt, testStart, testEnd, assertReport, assertReport2, testStart, testEnd, testStartEvt, testDoneEvt, suiteInfo];
