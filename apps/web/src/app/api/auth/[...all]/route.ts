import { toNextJsHandler } from 'better-auth/next-js';
import { auth } from '@/lib/clients/auth';

export const { GET, POST } = toNextJsHandler(auth.handler);
