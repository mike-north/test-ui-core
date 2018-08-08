import { PredicateObject } from 'object-predicate';
import JSReporters from './js-reporters';

// Basic Information
export interface EntityInfo {
  id: string;
  name: string;
  fullName: string[];
}
export interface RunInfo {
  id?: string;
  suites: SuiteInfo[];
}
export interface SuiteInfo extends EntityInfo {
  testCounts: {
    total: number;
  };
  childSuites?: SuiteInfo[];
  tests: TestInfo[];
}
export interface TestInfo extends EntityInfo {
  suiteName: string;
}

// Events
export interface TestDataEvent<K extends TestEventName, T> {
  event: K;
  data: T;
}
/**
 * Data that's emitted when the test run starts
 */
export interface RunStartEvent
  extends TestDataEvent<'runStart', JSReporters.SuiteStart> {}

/**
 * Data that's emitted when the test run finishes
 */
export interface RunEndEvent
  extends TestDataEvent<'runEnd', JSReporters.SuiteEnd> {}

/**
 * Data that's emitted when an individual test is about to run
 */
export interface TestStartEvent
  extends TestDataEvent<'testStart', JSReporters.TestStart> {}

/**
 * Data that's emitted when an individual test done running
 */
export interface TestEndEvent
  extends TestDataEvent<'testEnd', JSReporters.TestEnd> {}

/**
 * Data that's emitted when a test suite is done running
 */
export interface SuiteEndEvent
  extends TestDataEvent<'suiteEnd', JSReporters.SuiteEnd> {}

/**
 * Data that's emitted when a test suite is about to run
 */
export interface SuiteStartEvent
  extends TestDataEvent<'suiteStart', JSReporters.SuiteStart> {}

export interface TestDataEventMap {
  runStart: RunStartEvent;
  runEnd: RunEndEvent;
  testStart: TestStartEvent;
  testEnd: TestEndEvent;
  suiteStart: SuiteStartEvent;
  suiteEnd: SuiteEndEvent;
}

export type TestEventName = keyof TestDataEventMap;

export type TestDataEventFor<
  K extends keyof TestDataEventMap
> = TestDataEventMap[K];

export type AnyTestDataEvent =
  | RunStartEvent
  | RunEndEvent
  | TestStartEvent
  | TestEndEvent
  | SuiteStartEvent
  | SuiteEndEvent;

export type Predicate<T> = ((s: T) => boolean) | PredicateObject<Partial<T>>;
export type SuitePredicate = Predicate<SuiteInfo>;
