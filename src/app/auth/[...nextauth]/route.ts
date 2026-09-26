import { getAuth } from '@/lib/auth'

export const runtime = 'nodejs'

export const GET = (request: any, context: any) => getAuth().handlers.GET(request, context)
export const POST = (request: any, context: any) => getAuth().handlers.POST(request, context)
