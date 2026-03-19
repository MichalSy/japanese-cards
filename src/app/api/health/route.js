export async function GET() {
  return Response.json({
    status: 'ok',
    app: 'japanese-cards',
    timestamp: new Date().toISOString(),
  })
}
