import { NextResponse, type NextRequest } from "next/server";
import { chain } from "./middleware/chain";
import { withAuth } from "./middleware/auth.middleware";
import { withProfileCheck } from "./middleware/profile.middleware";
import { withI18n } from "./middleware/i18n.middleware";
import { withSignOut } from "./middleware/signout.middleware";
import { withPasswordResetErrorRedirect } from "./middleware/password-reset.middleware";
import { withPasswordRecoveryRestriction } from "./middleware/password-recovery.middleware";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isApiRoute = pathname.startsWith("/api");

  const initialResponse = NextResponse.next();

  const uiChain = chain(
    withI18n,
    withPasswordResetErrorRedirect,
    withPasswordRecoveryRestriction,
    withSignOut,
    withAuth,
    withProfileCheck
  );

  const apiChain = chain(withAuth);

  if (isApiRoute) {
    return apiChain(request, initialResponse);
  }

  return uiChain(request, initialResponse);
}

export const config = {
  matcher: ["/((?!_next|monitoring|.*\\..*).*)"],
};
