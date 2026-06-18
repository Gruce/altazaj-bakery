import { NextResponse } from 'next/server'
import { getMenu } from '@/lib/menu-data'

// Always serve fresh data; this is the live public menu feed.
export const dynamic = 'force-dynamic'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

/**
 * Public, CORS-open menu feed in the legacy `menu.json` shape (plus acts &
 * branches). Useful for external consumers and as an offline data source.
 */
export async function GET() {
  const menu = await getMenu()
  return NextResponse.json(
    {
      brand: menu.brand,
      categories: menu.categories,
      items: menu.items,
      featured: menu.featured,
      acts: menu.acts,
      branches: menu.branches,
      totalItems: menu.totalItems,
    },
    { headers: CORS },
  )
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS })
}
