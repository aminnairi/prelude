export interface Result<Value, Issue> {
  when: (success: (value: Value) => void, failure: (issue: Issue) => void) => void;
  or: <NewValue>(fallback: NewValue) => Value | NewValue;
}

export const ok = <Value>(value: Value): Result<Value, never> => {
  return {
    when: (success) => {
      success(value);
    },
    or: () => {
      return value;
    },
  };
};

export const error = <Issue>(issue: Issue): Result<never, Issue> => {
  return {
    when: (_, failure) => {
      failure(issue);
    },
    or: (fallback) => {
      return fallback;
    },
  };
};

export function when<Value, Issue>(success: (value: Value) => void, failure: (issue: Issue) => void): (result: Result<Value, Issue>) => void;
export function when<Value, Issue>(success: (value: Value) => void, failure: (issue: Issue) => void, result: Result<Value, Issue>): void;
export function when<Value, Issue>(success: (value: Value) => void, failure: (issue: Issue) => void, result?: Result<Value, Issue>) {
  const execute = (success: (value: Value) => void, failure: (issue: Issue) => void, result: Result<Value, Issue>) => {
    result.when(success, failure);
  };

  if (typeof result === "undefined") {
    return (result: Result<Value, Issue>) => {
      execute(success, failure, result);
    };
  }

  execute(success, failure, result);
}

export function or<NewValue, Value, Issue>(value: NewValue): (result: Result<Value, Issue>) => Value | NewValue;
export function or<NewValue, Value, Issue>(value: NewValue, result: Result<Value, Issue>): Value | NewValue;
export function or<NewValue, Value, Issue>(value: NewValue, result?: Result<Value, Issue>) {
  const execute = (value: NewValue, result: Result<Value, Issue>) => {
    return result.or(value);
  };

  if (typeof result === "undefined") {
    return (result: Result<Value, Issue>) => {
      return execute(value, result);
    };
  }

  return execute(value, result);
}
