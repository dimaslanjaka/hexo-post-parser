const logger = {
  /**
   * false to deactivate logger
   */
  active: true,
  assert: function (...args: any[]) {
    if (logger.active && logger.doAssert) {
      console.assert(...args);
    }
  },
  clear: function () {
    if (logger.active && logger.doClear) {
      console.clear();
    }
  },
  count: function (...args: any[]) {
    if (logger.active && logger.doCount) {
      console.count(...args);
    }
  },
  countReset: function (...args: any[]) {
    if (logger.active && logger.doCountReset) {
      console.countReset(...args);
    }
  },
  debug: function (...args: any[]) {
    if (logger.active && logger.doDebug) {
      console.debug(...args);
    }
  },
  dir: function (...args: any[]) {
    if (logger.active && logger.doDir) {
      console.dir(...args);
    }
  },
  dirxml: function (...args: any[]) {
    if (logger.active && logger.doDirxml) {
      console.dirxml(...args);
    }
  },
  error: function (...args: any[]) {
    if (logger.active && logger.doError) {
      console.error(...args);
    }
  },
  group: function (...args: any[]) {
    if (logger.active && logger.doGroup) {
      console.group(...args);
    }
  },
  groupCollapsed: function (...args: any[]) {
    if (logger.active && logger.doGroup) {
      console.groupCollapsed(...args);
    }
  },
  groupEnd: function () {
    if (logger.active && logger.doGroup) {
      console.groupEnd();
    }
  },
  info: function (...args: any[]) {
    if (logger.active && logger.doInfo) {
      console.info(...args);
    }
  },
  log: function (...args: any[]) {
    if (logger.active && logger.doLog) {
      console.log(...args);
    }
  },
  table: function (...args: any[]) {
    if (logger.active && logger.doTable) {
      console.table(...args);
    }
  },
  time: function (...args: any[]) {
    if (logger.active && logger.doTime) {
      console.time(...args);
    }
  },
  timeEnd: function (...args: any[]) {
    if (logger.active && logger.doTime) {
      console.timeEnd(...args);
    }
  },
  timeLog: function (...args: any[]) {
    if (logger.active && logger.doTime) {
      console.timeLog(...args);
    }
  },
  trace: function (...args: any[]) {
    if (logger.active && logger.doTrace) {
      console.trace(...args);
    }
  },
  warn: function (...args: any[]) {
    if (logger.active && logger.doWarn) {
      console.warn(...args);
    }
  },
  doAssert: true,
  doClear: true,
  doCount: true,
  doCountReset: true,
  doDebug: true,
  doDir: true,
  doDirxml: true,
  doError: true,
  doGroup: true,
  doInfo: true,
  doLog: true,
  doTable: true,
  doTime: true,
  doTrace: true,
  doWarn: true,
  timeStamp: function (label?: string): void {
    return console.timeStamp(label);
  },
  Console: undefined,
  profile: function (label?: string): void {
    return console.profile(label);
  },
  profileEnd: function (label?: string): void {
    return console.profileEnd(label);
  }
};

type newConsole = typeof logger &
  Console & {
    [key: string]: any;
  };

export default logger as newConsole;
