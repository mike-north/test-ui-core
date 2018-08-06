
export interface TestModule {
  name: string;
}

export interface TestDataEvent<K extends TestEventName> {
  event: K;
}

export interface StartTestDataEvent extends TestDataEvent<'start'> {}
export interface DoneTestDataEvent extends TestDataEvent<'done'> {}
export interface TestStartTestDataEvent extends TestDataEvent<'testStart'> {
  name: string;
}
export interface TestDoneTestDataEvent extends TestDataEvent<'testDone'> {
  name: string;
}
export interface SuiteDoneTestDataEvent extends TestDataEvent<'suiteStart'> {
  name: string;
}
export interface SuiteStartTestDataEvent extends TestDataEvent<'suiteDone'> {
  name: string;
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

export type TestDataEventFor<K extends keyof TestDataEventMap> = TestDataEventMap[K];

export type AnyTestDataEvent = StartTestDataEvent | DoneTestDataEvent | TestStartTestDataEvent | TestDoneTestDataEvent | SuiteStartTestDataEvent | SuiteDoneTestDataEvent;
