import * as future from "./future";

export class HttpError extends Error {
  public override readonly name = "HttpError";

  public constructor(public readonly error: unknown) {
    super();
  }
}

export class JsonError extends Error {
  public override readonly name = "JsonError";

  public constructor(public readonly error: Error) {
    super();
  }
}

export const getText = (url: string, options: RequestInit = {}) => {
  return future.of<Response, HttpError | future.UnexpectedIssue>((succeed, fail) => {
    fetch(url, options).then(response => {
      succeed(response);
    }).catch(error => {
      fail(new HttpError(error));
    });
  });
};

export const getJson = (url: string, options: RequestInit = {}) => {
  return future.of<JSON, JsonError | future.UnexpectedIssue>((succeed, fail) => {
    fetch(url, options).then(response => {
      return response.json();
    }).then(json => {
      succeed(json);
    }).catch(error => {
      fail(new JsonError(error));
    });
  });
};
