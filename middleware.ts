// import { i18nRouter } from 'next-i18n-router';
// import i18nConfig from './i18nConfig';
// import { NextResponse} from 'next/server';
// import { NextRequest } from 'next/server';
// import { cookies } from 'next/headers';
// import { getIronSession } from 'iron-session';
// import { jwtDecode } from 'jwt-decode';
// import { SessionInter, sessionOptions } from '@/Utils-H/interfaces';
// import { Subdomains } from '@/dataSource';

import { chain } from "./middlewares/chain";
import { withMiddlewareAuth } from "./middlewares/wareAuthentication";
import { withMiddlewareDomains } from "./middlewares/wareDomains";
import { withMiddlewareInter } from "./middlewares/wareInternationalization";


const middleware = [ withMiddlewareAuth, withMiddlewareDomains, withMiddlewareInter ]
export default chain(middleware)

export const config = {
    matcher: [ "/((?!api|static|.*\\..*|_next/image|favicon.ico).*)" ]
}