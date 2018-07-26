import Adapter from '../adapter';

export default class QUnitAdapter extends Adapter {}

declare module '@test-ui/client' {
  export interface AdapterMap {
    qunit: QUnitAdapter;
  }
  export interface AdapterOptionsMap {
    qunit: undefined;
  }
}
