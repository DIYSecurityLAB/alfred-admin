export type DefaultResultError = { 
  code: 'UNKNOWN_ERROR' | 'UNAUTHORIZED' | 'NOT_FOUND' | 'BAD_REQUEST' | 'ALREADY_EXISTS' 
};

export class ResultOld<T, E = DefaultResultError> {
  private constructor(
    public readonly isSuccess: boolean,
    public readonly value?: T,
    public readonly error?: E
  ) {}

  static Success<T, E>(value: T): ResultOld<T, E> {
    return new ResultOld<T, E>(true, value);
  }

  static Error<T, E>(error: E): ResultOld<T, E> {
    return new ResultOld<T, E>(false, undefined, error);
  }

  public fold<R>(onSuccess: (value: T) => R, onError: (error: E) => R): R {
    if (this.isSuccess && this.value !== undefined) {
      return onSuccess(this.value);
    } else if (!this.isSuccess && this.error !== undefined) {
      return onError(this.error);
    }
    throw new Error('Invalid state: Result must be either success with value or error with error object');
  }
}
