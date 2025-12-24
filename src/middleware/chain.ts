import { NextRequest, NextResponse } from "next/server";
import { MiddlewareFunction } from "./types";

/**
 * Chains multiple middleware functions together
 */
export function chain(...middlewares: MiddlewareFunction[]) {
  return async (request: NextRequest, initialResponse: NextResponse) => {
    let response = initialResponse;

    for (const middleware of middlewares) {
      response = await middleware(request, response);

      // If middleware returned a redirect, stop chain
      if (response.status >= 300 && response.status < 400) {
        return response;
      }
    }

    return response;
  };
}
