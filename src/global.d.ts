
interface QUnitBeginDetails { totalTests: number }
interface QUnitDoneDetails { failed: number, passed: number, total: number, runtime: number }
interface QUnitLogDetails {
    result: boolean,
    actual: any;
    expected: any;
    message: string;
    source: string;
    module: string;
    name: string;
    runtime: number;
}
interface QUnitModuleDoneDetails {
    name: string;
    failed: number;
    passed: number;
    total: number;
    runtime: number;
}
interface QUnitModuleStartDetails { name: string }
interface QUnitTestDoneDetails {
    name: string;
    module: string;
    failed: number;
    passed: number;
    total: number;
    runtime: number;
}
interface QUnitTestStartDetails { name: string; module: string; }
