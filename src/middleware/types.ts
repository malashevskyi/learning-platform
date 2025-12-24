import { NextRequest, NextResponse } from "next/server";

export type MiddlewareFunction = (
  request: NextRequest,
  response: NextResponse
) => Promise<NextResponse> | NextResponse;
