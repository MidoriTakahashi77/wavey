export type Result<T, E> = Success<T> | Failure<E>;

export class Success<T> {
  readonly isSuccess = true as const;
  readonly isFailure = false as const;

  constructor(readonly value: T) {}
}

export class Failure<E> {
  readonly isSuccess = false as const;
  readonly isFailure = true as const;

  constructor(readonly error: E) {}
}

export function ok<T>(value: T): Success<T> {
  return new Success(value);
}

export function err<E>(error: E): Failure<E> {
  return new Failure(error);
}
