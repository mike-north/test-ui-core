import {
  BeginData,
  Data,
  DataPayload,
  DoneData,
  ExtractPropertiesOfType,
  ModuleDoneData,
  ModuleInfo,
  ModuleStartData,
  TestDoneData,
  TestStartData
} from './types';

import { QUnitModuleDetails } from 'qunit-metadata';
import './adapter/qunit';

type QUnitCallbackFunctions = ExtractPropertiesOfType<
  QUnit,
  (cb: (arg: any) => any) => void
>;

export type CallbackNames =
  | 'begin'
  | 'done'
  | 'moduleStart'
  | 'moduleDone'
  | 'testStart'
  | 'testDone';

type QUnitCallback<K extends keyof QUnitCallbackFunctions> = typeof QUnit[K];

type FirstArgType<T> = T extends (arg: infer S) => void ? S : never;

type QUnitCallbackArg<K extends keyof QUnitCallbackFunctions> = FirstArgType<
  FirstArgType<QUnitCallback<K>>
>;

const DISALLOWED_MODULE_PROPS = ['hooks'];
const SERIALIZABLE_MODULE_INFO_PATCH = DISALLOWED_MODULE_PROPS.reduce(
  (p, k) => {
    p[k] = null;
    return p;
  },
  {} as any
);

function zip<A, B>(a: A[], b: B[]): Array<[A, B]> {
  return a.reduce(
    (acc, ai, idx) => {
      const item: [A, B] = [ai, b[idx]];
      acc.push(item);
      return acc;
    },
    [] as Array<[A, B]>
  );
}

function transformQUnitModuleDetailsToModuleInfo(
  md: QUnitModuleDetails
): ModuleInfo {
  return {
    id: md.moduleId,
    name: md.name,
    fullName:
      typeof md.suiteReport !== 'undefined' ? md.suiteReport.fullName : [],
    parent: md.parentModule,
    meta: md.meta || {},
    tests: zip(md.tests, (md.suiteReport || { tests: [] }).tests).map(
      ([t, tr]: [any, any]) => {
        return {
          id: t.id,
          name: tr.name,
          fullName: tr.fullName,
          skipped: tr.skpped,
          todo: tr.todo,
          valid: tr.valid,
          meta: t.meta || {},
          runtime: tr.runtime,
          assertions: tr.assertions.map((a: any) => {
            const { message, passed, todo, stack } = a;
            return {
              message,
              passed,
              todo,
              stack
            };
          })
        };
      }
    ),
    count: {
      tests: {
        run: md.testsRun || 0,
        unskippedRun: md.unskippedTestsRun || 0
      }
    }
  };
}

function normalizeQunitModules(raw: QUnitModuleDetails[]): ModuleInfo[] {
  return raw.map(transformQUnitModuleDetailsToModuleInfo);
}

function normalizeQunitCallbackData<K extends CallbackNames>(
  event: K,
  data: QUnitCallbackArg<K>
): Data {
  switch (event) {
    case 'begin': {
      let d = data as QUnitCallbackArg<'begin'>;
      let r: BeginData = {
        counts: { total: { tests: d.totalTests } }
      };
      return r;
    }
    case 'done': {
      let d = data as QUnitCallbackArg<'done'>;
      let x: DoneData = {
        counts: {
          total: {
            tests: d.total,
            failed: d.failed,
            passed: d.passed
          }
        }
      };
      return x;
    }
    case 'moduleStart': {
      let d = data as QUnitCallbackArg<'moduleStart'>;
      let { name } = d;
      let tests = (d as any).tests;
      let r: ModuleStartData = {
        name,
        tests: tests.map((t: any) => {
          return {
            name: t.name,
            id: t.testId,
            skip: t.skip
          };
        })
      };
      return r;
    }
    case 'moduleDone': {
      let d = data as QUnitCallbackArg<'moduleDone'>;
      let { name } = d;
      let tests = (d as any).tests;
      let r: ModuleDoneData = {
        name,
        tests: tests.map((t: any) => {
          return {
            name: t.name,
            id: t.testId,
            skip: t.skip
          };
        })
      };
      return r;
    }
    case 'testStart': {
      let d = data as QUnitCallbackArg<'testStart'>;
      let { name, module: moduleName, testId: id } = d as any;
      let r: TestStartData = { name, moduleName, id };
      return r;
    }
    case 'testDone': {
      let d = data as QUnitCallbackArg<'testDone'>;
      let { name, module: moduleName, testId: id } = d as any;
      let r: TestDoneData = { name, moduleName, id };
      return r;
    }
    default:
      throw new Error(`Unknown callback type: ${event}`);
  }
}

function getQUnitSerializableModuleInfo() {
  return (QUnit.config as any).modules.map((m: any) => {
    return { ...m, ...SERIALIZABLE_MODULE_INFO_PATCH };
  });
}

function qUnitMessageParent<K extends CallbackNames>(
  event: K,
  data: QUnitCallbackArg<K>
) {
  const payload: DataPayload = {
    _testFrame: true,
    event,
    data: normalizeQunitCallbackData(event, data),
    state: {
      modules: normalizeQunitModules(getQUnitSerializableModuleInfo())
    }
  };
  if (window && window.parent) {
    window.parent.postMessage(payload, '*');
  }
}

export function setupQUnitTestFrame(q: QUnit) {
  if (QUnit === void 0) throw new Error('No QUnit detected');
  q.moduleStart(details => qUnitMessageParent('moduleStart', details));
  q.testStart(details => qUnitMessageParent('testStart', details));
  q.testDone(details => qUnitMessageParent('testDone', details));
  q.moduleDone(details => qUnitMessageParent('moduleDone', details));
  q.done(details => qUnitMessageParent('done', details));
}
