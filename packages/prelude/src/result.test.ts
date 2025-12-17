import { describe, test, expect, vi } from "vitest";
import * as result from "./result";
import * as chain from "./chain";

describe("result", () => {
  test("ok", () => {
    const output = chain
      .of(123)
      .and(result.ok)
      .and(result.or(0))
      .link();

    expect(output).toStrictEqual(123);
  });

  test("error", () => {
    const output = chain
      .of(new Error)
      .and(result.error)
      .and(result.or(123))
      .link();

    expect(output).toStrictEqual(123);
  });

  test("or uncurried", () => {
    const input = chain.of(123).and(result.ok).link();
    const fallback = 0;
    const output = result.or(fallback, input);

    expect(output).toStrictEqual(123);
  });

  test("when ok uncurried", () => {
    const input = chain.of(123).and(result.ok).link();
    const success = vi.fn();
    const failure = vi.fn();

    result.when(success, failure, input);

    expect(success).toHaveBeenCalledOnce();
    expect(failure).not.toHaveBeenCalled();
  });

  test("when error uncurried", () => {
    const input = chain.of(new Error).and(result.error).link();
    const success = vi.fn();
    const failure = vi.fn();

    result.when(success, failure, input);

    expect(failure).toHaveBeenCalledOnce();
    expect(success).not.toHaveBeenCalled();
  });

  test("when ok", () => {
    const success = vi.fn();
    const failure = vi.fn();

    chain
      .of(123)
      .and(result.ok)
      .and(result.when(success, failure))

    expect(success).toHaveBeenCalledOnce();
    expect(failure).not.toHaveBeenCalled();
  });

  test("when error", () => {
    const success = vi.fn();
    const failure = vi.fn();

    chain
      .of(new Error)
      .and(result.error)
      .and(result.when(success, failure))

    expect(failure).toHaveBeenCalledOnce();
    expect(success).not.toHaveBeenCalled();
  });
});
