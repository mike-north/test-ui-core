import { PredicateObject } from 'object-predicate';
import { TestModule } from './types';

function generateId(): string {
  return Math.round(Math.random() * 1e9).toString(36);
}

export type StateId = string;

export interface StateReference {
  readonly id: StateId;
}

/**
 * Some serializable state that can be passed from client-to-server
 */
export interface State<T = PredicateObject<TestModule>> extends StateReference {
  data?: T;
}

export function createState<T = PredicateObject<TestModule>>(
  data?: T
): State<T> {
  return {
    id: generateId(),
    data
  };
}
