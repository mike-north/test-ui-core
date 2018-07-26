import Adapter from '../adapter';

export default class MochaAdapter extends Adapter {}

declare module '@test-ui/client' {
  export interface AdapterMap {
    mocha: MochaAdapter;
  }
  export interface AdapterOptionsMap {
    mocha: undefined;
  }
}
