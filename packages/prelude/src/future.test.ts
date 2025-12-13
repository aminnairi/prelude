import { describe, test, expect, vi } from "vitest";
import * as future from "./future";
import * as chain from "./chain";

describe("future", () => {
  test("UnexpectedIssue", () => {
    const result = new future.UnexpectedIssue("Error");

    expect(result.name).toStrictEqual("UnexpectedIssue");
    expect(result.error).toStrictEqual("Error");
  });

  test("of", () => {
    future.of(() => {
      throw new Error("Error");
    }).when(
      value => {
        expect.fail(value);
      },
      issue => {
        expect(issue.name).toStrictEqual("UnexpectedIssue");
        expect(issue.error).toBeInstanceOf(Error);
      }
    );
  });

  test("exported when with success", () => {
    const successSpy = vi.fn();
    const failureSpy = vi.fn();

    chain.of(future.succeed(123))
      .and(future.when(successSpy, failureSpy))
      .value();

    expect(successSpy).toHaveBeenCalledWith(123);
    expect(failureSpy).not.toHaveBeenCalled();
  });

  test("exported when with failure", () => {
    const successSpy = vi.fn();
    const failureSpy = vi.fn();
    const testError = "Something went wrong";

    chain.of(future.fail(testError))
      .and(future.when(successSpy, failureSpy))
      .value();

    expect(successSpy).not.toHaveBeenCalled();
    expect(failureSpy).toHaveBeenCalledWith(testError);
  });


  test("succeed", () => {
    future.succeed(123).when(
      value => {
        expect(value).toStrictEqual(123);
      },
      issue => {
        expect.fail(issue.message);
      }
    );
  });

  test("fail", () => {
    future.fail("Error").when(
      value => {
        expect.fail(`Received value ${value} instead of Error`);
      },
      issue => {
        expect(issue).toStrictEqual("Error");
      }
    );
  });

  test("update", () => {
    chain
      .of(future.of<number, never>((succeed) => {
        succeed(123);
      }))
      .and(future.update(value => value * 2))
      .value()
      .when(
        value => {
          expect(value).toStrictEqual(246);
        },
        issue => {
          expect.fail(issue.message);
        }
      );

    chain
      .of(future.of<number, never>(() => {
        throw new Error("Error");
      }))
      .and(future.update(value => value * 2))
      .value()
      .when(
        value => {
          expect.fail(`Unexpected value ${value}`);
        },
        issue => {
          expect(issue.error).toBeInstanceOf(Error);
        }
      );
  });

  test("upgrade", () => {
    chain
      .of(future.of<number>((succeed) => succeed(123)))
      .and(future.upgrade(value => future.of<number>(succeed => succeed(value * 2))))
      .value()
      .when(
        value => {
          expect(value).toStrictEqual(246);
        },
        issue => {
          expect.fail(issue.message);
        }
      );

    chain
      .of(future.of<number>(() => {
        throw new Error("Error");
      }))
      .and(future.upgrade(value => future.of<number>(succeed => succeed(value * 2))))
      .value()
      .when(
        value => {
          expect.fail(`Unexpected value ${value}`);
        },
        issue => {
          expect(issue.error).toBeInstanceOf(Error);
        }
      );

    chain
      .of(future.of<number>((succeed) => succeed(123)))
      .and(future.upgrade(() => future.of<number>(() => {
        throw new Error("Error");
      })))
      .value()
      .when(
        value => {
          expect.fail(`Unexpected value ${value}`);
        },
        issue => {
          expect(issue.error).toBeInstanceOf(Error);
        }
      );
  });
});
