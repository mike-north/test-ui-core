export type ExtractPropertyNamesOfType<T, S> = {
  [K in keyof T]: T[K] extends S ? K : never
}[keyof T];
export type ExcludePropertyNamesOfType<T, S> = {
  [K in keyof T]: T[K] extends S ? never : K
}[keyof T];
export type ExtractPropertiesOfType<T, S> = Pick<
  T,
  ExtractPropertyNamesOfType<T, S>
>;
export type ExcludePropertiesOfType<T, S> = Pick<
  T,
  ExcludePropertyNamesOfType<T, S>
>;

export interface BeginData {
  counts: {
    total: {
      tests: number
    };
  };
}
export interface DoneData {
  counts: {
    total: {
      tests: number;
      failed: number;
      passed: number;
    };
  };
}
export interface ModuleStartData {
  name: string;
  tests: Array<{name: string; id: string; skip: boolean}>;
}
export interface ModuleDoneData {
  name: string;
  tests: Array<{name: string; id: string; skip: boolean}>;
}
export interface TestStartData {
  moduleName: string;
  name: string;
  id: string;
}
export interface TestDoneData {
  moduleName: string;
  name: string;
  id: string;
}

export type Data = BeginData | TestStartData | TestDoneData | ModuleDoneData | ModuleStartData;
