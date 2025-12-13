import { describe, test, expect } from "vitest";
import * as future from "./future";
import * as stream from "./stream";

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

  test("when", () => {
    future.of<number, never>((succeed) => {
      succeed(123);
    }).when(
      value => {
        expect(value).toStrictEqual(123);
      },
      issue => {
        expect.fail(issue.message);
      }
    );
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
    stream
      .of(future.of<number, never>((succeed) => {
        succeed(123);
      }))
      .next(future.update(value => value * 2))
      .value()
      .when(
        value => {
          expect(value).toStrictEqual(246);
        },
        issue => {
          expect.fail(issue.message);
        }
      );

    stream
      .of(future.of<number, never>(() => {
        throw new Error("Error");
      }))
      .next(future.update(value => value * 2))
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
    stream
      .of(future.of<number>((succeed) => succeed(123)))
      .next(future.upgrade(value => future.of<number>(succeed => succeed(value * 2))))
      .value()
      .when(
        value => {
          expect(value).toStrictEqual(246);
        },
        issue => {
          expect.fail(issue.message);
        }
      );

    stream
      .of(future.of<number>(() => {
        throw new Error("Error");
      }))
      .next(future.upgrade(value => future.of<number>(succeed => succeed(value * 2))))
      .value()
      .when(
        value => {
          expect.fail(`Unexpected value ${value}`);
        },
        issue => {
          expect(issue.error).toBeInstanceOf(Error);
        }
      );

    stream
      .of(future.of<number>((succeed) => succeed(123)))
      .next(future.upgrade(() => future.of<number>(() => {
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
