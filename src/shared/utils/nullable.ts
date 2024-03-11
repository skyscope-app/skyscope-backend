export type Nullable<T> = T | null | undefined;

export function assertNullable<T>(data?: T): Nullable<T> {
  return !!data ? data : null;
}
