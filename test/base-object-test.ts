import { Level } from 'bite-log';
import { suite, test } from 'qunit-decorators';
import BaseObject from '../src/base-object';

@suite
export class BaseObjectTests {
  @test
  'can instantiate with no options'(assert: Assert) {
    let bo = new BaseObject();
    assert.ok(bo, 'it exists');
  }

  @test
  'can instantiate, passed only a log level'(assert: Assert) {
    let bo = new BaseObject({ logLevel: Level.error });
    assert.ok(bo, 'it exists');
  }

  @test
  'invokes "cleanupOnDestroy" tasks on destroy'(assert: Assert) {
    let cleanups = 0;
    class C extends BaseObject {
      constructor() {
        super();
        this.cleanupOnDestroy.push(function cleanup() {
          cleanups++;
        });
      }
    }
    const instance = new C();
    assert.ok(instance);
    assert.equal(cleanups, 0, 'Cleanup function was not invoked');
    instance.destroy();
    assert.equal(cleanups, 1, 'Cleanup function was invoked after .destroy() was called');
  }
}
