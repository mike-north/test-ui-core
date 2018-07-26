import { Data, ExtractPropertiesOfType } from './types';

type QUnitCallbackFunctions = ExtractPropertiesOfType<
  QUnit,
  (cb: (arg: any) => any) => void
>;

type CallbackNames =
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

function normalizeQunitCallbackData<K extends CallbackNames>(
  event: K,
  data: QUnitCallbackArg<K>
): Data {
  switch (event) {
    case 'begin': {
      // let d = data as QUnitCallbackArg<'begin'>;
      return { modulePath: [], name: '' };
    }
    case 'done': {
      // let d = data as QUnitCallbackArg<'done'>;
      return { modulePath: [], name: '' };
    }
    case 'moduleStart': {
      let d = data as QUnitCallbackArg<'moduleStart'>;
      return { modulePath: [d.name], name: '' };
    }
    case 'moduleDone': {
      let d = data as QUnitCallbackArg<'moduleDone'>;
      return { modulePath: [d.name], name: '' };
    }
    case 'testStart': {
      let d = data as QUnitCallbackArg<'testStart'>;
      let { name } = d;
      return { modulePath: [d.module], name };
    }
    case 'testDone': {
      let d = data as QUnitCallbackArg<'testDone'>;
      let { name } = d;
      return { modulePath: [d.module], name };
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
  if (window && window.parent) {
    window.parent.postMessage(
      { _testFrame: true, event, data: normalizeQunitCallbackData(event, data), modules: getQUnitSerializableModuleInfo() },
      '*'
    );
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
