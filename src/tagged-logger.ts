export const enum Level {
  Error, Warn, Info, Debug
}

const CONSOLE_METHOD_MAP: {[k: number]: typeof console.log} = {
  [Level.Error]: console.error,
  [Level.Warn]: console.warn,
  [Level.Info]: console.info,
  [Level.Debug]: console.log
};

export default class TaggedLogger {
  protected tags: string[] = [];
  constructor(private level: Level) {}

  debug(message: string, ...args: any[]) {
    this.printMessage(Level.Debug, message, ...args);
  }
  info(message: string, ...args: any[]) {
    this.printMessage(Level.Info, message, ...args);
  }
  warn(message: string, ...args: any[]) {
    this.printMessage(Level.Warn, message, ...args);
  }
  error(message: string, ...args: any[]) {
    this.printMessage(Level.Error, message, ...args);
  }
  pushTag(tag: string) {this.tags.push(tag); }
  popTag() { this.tags.pop(); }
  private tagString() {
    return this.tags.map(t => `[${t}]`).join('');
  }
  private printMessage(level: Level, message: string, ...args: any[]) {
    if (level <= this.level) {
      CONSOLE_METHOD_MAP[level](`${this.tagString()}: ${message}`, ...args);
    }
  }
}
