export interface TestModule {
  name: string;
}

export interface TestDataEvent<K extends TestEventName> {
  event: K;
}

export interface StartTestDataEvent extends TestDataEvent<'start'> {}
export interface DoneTestDataEvent extends TestDataEvent<'done'> {
  numTestsPassed: number;
  numTestsFailed: number;
  duration: number;
}
export interface TestStartTestDataEvent extends TestDataEvent<'testStart'> {
  name: string;
  moduleId: string;
}
export interface TestDoneTestDataEvent extends TestDataEvent<'testDone'> {
  name: string;
  moduleId: string;
  isPassed: boolean;
  duration: number;
  error?: string;
}
export interface SuiteDoneTestDataEvent extends TestDataEvent<'suiteStart'> {
  name: string;
  numTestsPassed: number;
  numTestsFailed: number;
  duration: number;
}
export interface SuiteStartTestDataEvent extends TestDataEvent<'suiteDone'> {
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
