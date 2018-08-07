
// tslint:disable-next-line:no-namespace
namespace JSReporters {
  export type EventNames = 'runStart' | 'runEnd' | 'suiteStart' | 'suiteEnd' | 'testStart' | 'testEnd';
  export type Status = 'failed' | 'skipped' | 'todo' | 'passed';

  export interface Suite {

  }
  export interface Test {

  }

  export interface Assertion<T = any> {
    passed: boolean;
    actual: T;
    expected: T;
    message: string;
    stack?: string;
    todo: boolean;
  }

  export interface SuiteStart {
    name?: string;
    fullName: string[];
    tests: Test[];
    childSuites: Suite[];
    testCounts: {
      total: number;
    };
  }

  export interface SuiteEnd extends SuiteStart {
    status: Status;
    testCounts: {
      passed: number;
      failed: number;
      skipped: number;
      todo: number;
      total: number;
    };
    runtime: number;
  }

  export interface TestStart {
    name: string;
    suiteName: string;
    fullName: string[];
  }

  export interface TestEnd extends TestStart {
    status: Status;
    runtime: number;
    errors: Assertion[];
    assertions: Assertion[];
  }
}

export default JSReporters;
