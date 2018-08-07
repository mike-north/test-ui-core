export interface SuiteInfo {
  parentId?: string;
  id: string;
  name: string;
}

export interface TestInfo {
  id: string;
  name: string;
  suiteId: string;
}
export interface TestRunData extends TestInfo {
  isSkipped: boolean;
  duration: number;
  error?: string;
}
export interface SuiteRunData extends SuiteInfo {
  isSkipped: boolean;
  duration: number;
  numTestsPassed: number;
  numTestsFailed: number;
}

export interface AssertionReport {
  message: string;
  passed: boolean;
}
export interface TestReport extends TestRunData {
  assertions: AssertionReport[];
}
export interface SuiteReport extends SuiteRunData {
  suites: SuiteReport[];
  tests: TestReport[];
}
export interface RunReport {
  suites: SuiteReport[];
}

export interface TestDataEvent<K extends TestEventName> {
  event: K;
  report: RunReport;
}
/**
 * Data that's emitted when the test run starts
 */
export interface StartTestDataEvent extends TestDataEvent<'start'> {}

/**
 * Data that's emitted when the test run finishes
 */
export interface DoneTestDataEvent extends TestDataEvent<'done'> {
  numTestsPassed: number;
  numTestsFailed: number;
}

/**
 * Data that's emitted when an individual test is about to run
 */
export interface TestStartTestDataEvent extends TestDataEvent<'testStart'> {
  name: string;
  moduleId: string;
}

/**
 * Data that's emitted when an individual test done running
 */
export interface TestDoneTestDataEvent extends TestDataEvent<'testDone'>, TestInfo {
  error?: string;
}
/**
 * Data that's emitted when a test suite is done running
 */
export interface SuiteDoneTestDataEvent extends TestDataEvent<'suiteDone'>, SuiteInfo {

}
/**
 * Data that's emitted when a test suite is about to run
 */
export interface SuiteStartTestDataEvent extends TestDataEvent<'suiteStart'> {
  name: string;
  numTests: number;
}

export interface TestDataEventMap {
  start: StartTestDataEvent;
  done: DoneTestDataEvent;
  testStart: TestStartTestDataEvent;
  testDone: TestDoneTestDataEvent;
  suiteStart: SuiteStartTestDataEvent;
  suiteDone: SuiteDoneTestDataEvent;
}

export type TestEventName = keyof TestDataEventMap;

export type TestDataEventFor<
  K extends keyof TestDataEventMap
> = TestDataEventMap[K];

export type AnyTestDataEvent =
  | StartTestDataEvent
  | DoneTestDataEvent
  | TestStartTestDataEvent
  | TestDoneTestDataEvent
  | SuiteStartTestDataEvent
  | SuiteDoneTestDataEvent;
