// Basic Information
export interface EntityInfo {
  id: string;
  name: string;
}
export interface RunInfo {
  id?: string;
  suites: SuiteInfo[];
}
export interface SuiteInfo extends EntityInfo {
  parentId?: string;
  tests: TestInfo[];
}
export interface TestInfo extends EntityInfo {
  suiteId: string;
}
// Shared types that keep consistency between TestRun state and Events
export interface TestRunData extends TestInfo, SingleResultStats {
  error?: string;
}
export interface SuiteRunData extends SuiteInfo, GroupResultStats {}

export interface SingleResultStats {
  isPassed: boolean;
  isSkipped: boolean;
  duration: number;
}
export interface GroupResultStats extends SingleResultStats {
  numPassed: number;
  numFailed: number;
}
// Modeling TestRun State

export interface RunReport extends GroupResultStats {
  suites: SuiteReport[];
}

export interface SuiteReport extends SuiteRunData {
  childSuites?: SuiteReport[];
  tests: TestReport[];
}

export interface TestReport extends TestRunData {
  assertions: AssertionReport[];
}

export interface AssertionReport {
  message: string;
  isPassed: boolean;
}

// Events
export interface TestDataEvent<K extends TestEventName> {
  event: K;
}
/**
 * Data that's emitted when the test run starts
 */
export interface StartTestDataEvent extends TestDataEvent<'start'> {
  info: RunInfo;
}

/**
 * Data that's emitted when the test run finishes
 */
export interface DoneTestDataEvent extends TestDataEvent<'done'> {
  info: RunInfo;
  report: RunReport;
}

/**
 * Data that's emitted when an individual test is about to run
 */
export interface TestStartTestDataEvent extends TestDataEvent<'testStart'> {
  info: TestInfo;
}

/**
 * Data that's emitted when an individual test done running
 */
export interface TestDoneTestDataEvent extends TestDataEvent<'testDone'> {
  report: TestReport;
  info: TestInfo;
  error?: string;
}
/**
 * Data that's emitted when a test suite is done running
 */
export interface SuiteDoneTestDataEvent extends TestDataEvent<'suiteDone'> {
  report: SuiteReport;
  info: SuiteInfo;
}
/**
 * Data that's emitted when a test suite is about to run
 */
export interface SuiteStartTestDataEvent extends TestDataEvent<'suiteStart'> {
  info: SuiteInfo;
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
