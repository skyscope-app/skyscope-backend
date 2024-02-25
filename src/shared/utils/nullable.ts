export type Nullable<T> = T | null;

export function assertNullable<T>(data?: T): Nullable<T> {
  return !!data ? data : null;
}
