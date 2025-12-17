import { describe, test, expect, vi } from "vitest";
import * as chain from "./chain";
import * as http from "./http";
import * as future from "./future";

describe("http", () => {
  describe("get", () => {
    test("success", () => {
      vi.stubGlobal("fetch", () => {
        return Promise.resolve(new Response("Body"));
      });

      chain.of(http.getText("https://jsonplaceholder.typicode.com/users"))
        .and(future.when(
          response => {
            expect(response).toBeInstanceOf(Response);
          },
          issue => {
            expect.fail(`Received an error: ${issue.error}`);
          }
        ));

      vi.unstubAllGlobals();
    });

    test("HTTPError", () => {
      vi.stubGlobal("fetch", () => {
        return Promise.reject(new http.HttpError(new Error()));
      });

      chain.of(http.getText("https://jsonplaceholder.typicode.com/users")).and(future.when(
        () => {
          expect.fail("This should not succeed");
        },
        issue => {
          expect(issue).toBeInstanceOf(http.HttpError);
        }
      ));

      vi.unstubAllGlobals();
    });
  });

  describe("getJson", () => {
    test("success", () => {
      vi.stubGlobal("fetch", () => {
        return Promise.resolve(new Response(JSON.stringify({
          success: true
        })));
      });

      chain
        .of(http.getJson("https://jsonplaceholder.typicode.com/users"))
        .and(future.when(
          (json) => {
            expect(json).toStrictEqual({
              success: true
            });
          },
          issue => {
            expect.fail(`Received an error: ${issue.error}`);
          }
        ));

      vi.unstubAllGlobals();
    });

    test("JsonError", () => {
      vi.stubGlobal("fetch", () => {
        return Promise.reject(new http.JsonError(new Error()));
      });

      chain
        .of(http.getJson("https://jsonplaceholder.typicode.com/users"))
        .and(future.when(
          () => {
            expect.fail("This should not succeed");
          },
          issue => {
            expect(issue).toBeInstanceOf(http.JsonError);
          }
        ));

      vi.unstubAllGlobals();
    });
  });
});
