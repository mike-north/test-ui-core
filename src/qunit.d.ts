declare module 'qunit' {
  interface QUnit {
    done(callback: (details: QUnitDoneDetails) => void): void;
    begin(callback: (details: QUnitBeginDetails) => void): void;
    log(callback: (details: QUnitLogDetails) => void): void;
    moduleDone(callback: (details: QUnitModuleDoneDetails) => void): void;

    moduleStart(callback: (details: QUnitModuleStartDetails) => void): void;
    testDone(callback: (details: {
      name: string;
      module: string;
      failed: number;
      passed: number;
      total: number;
      runtime: number;
  }) => void): void;
  testStart(callback: (details: QUnitTestStartDetails) => void): void;
  }
}