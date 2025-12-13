export class UnexpectedIssue extends Error {
  public override readonly name = "UnexpectedIssue";

  public constructor(public readonly error: unknown) {
    super();
  }
}

export interface Future<Value = never, Issue = UnexpectedIssue> {
  when: (success: (value: Value) => void, failure: (issue: Issue | UnexpectedIssue) => void) => void
}

export const of = <Value = never, Issue = UnexpectedIssue>(run: (succeed: (value: Value) => void, fail: (issue: Issue) => void) => void): Future<Value, Issue | UnexpectedIssue> => {
  return {
    when: (succeed, fail) => {
      try {
        run(succeed, fail);
      } catch (error) {
        fail(new UnexpectedIssue(error));
      }
    },
  };
};

export const succeed = <Value = never>(value: Value): Future<Value> => {
  return of((succeed) => {
    succeed(value);
  });
};

export const fail = <Issue>(issue: Issue): Future<never, Issue | UnexpectedIssue> => {
  return of((_, fail) => {
    fail(issue);
  });
};

export const update = <Value, Issue, NewValue>(transform: (value: Value) => NewValue) => {
  return (future: Future<Value, Issue>) => {
    return of<NewValue, Issue | UnexpectedIssue>((succeed, fail) => {
      future.when(
        value => {
          succeed(transform(value));
        },
        issue => {
          fail(issue);
        }
      );
    })
  };
};

export const upgrade = <Value, Issue, NewValue, NewIssue>(update: (value: Value) => Future<NewValue, NewIssue>) => {
  return (future: Future<Value, Issue>) => {
    return of<NewValue, Issue | NewIssue | UnexpectedIssue>((succeed, fail) => {
      future.when(
        value => {
          update(value).when(
            value => {
              succeed(value);
            },
            issue => {
              fail(issue);
            }
          );
        },
        issue => {
          fail(issue);
        }
      );
    });
  };
};

export const when = <Value, Issue>(success: (value: Value) => void, failure: (issue: Issue | UnexpectedIssue) => void) => {
  return (future: Future<Value, Issue>) => {
    future.when(success, failure);
    return future;
  };
};
