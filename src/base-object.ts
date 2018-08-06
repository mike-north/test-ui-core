import Logger, { Level, LoggerWithStyles } from 'bite-log';

// tslint:disable-next-line:no-namespace
namespace BaseObject {
  export interface Options {
    logLevel?: Level;
  }
}

const OPTION_DEFAULTS: BaseObject.Options = {
  logLevel: 2
};
/**
 * Combine a sparse object with a clone of a default object
 * @param defaults
 * @param provided
 */
export function optsWithDefaults<T extends {}>(
  defaults: T,
  provided?: Partial<T>
): T {
  const defaultsCopy = Object.assign({}, defaults);
  if (provided === void 0) return defaultsCopy;
  return Object.assign(defaultsCopy, provided);
}
class BaseObject {
  protected log: LoggerWithStyles;
  protected cleanupOnDestroy: Array<() => any> = [];
  constructor(options?: BaseObject.Options) {
    const opts = optsWithDefaults(OPTION_DEFAULTS, options);
    this.log = new Logger(opts.logLevel);
  }
  destroy() {
    this.cleanupOnDestroy.forEach(f => f());
  }
}

export default BaseObject;
