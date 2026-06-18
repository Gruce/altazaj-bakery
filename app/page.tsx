import { getMenuData } from '@/lib/menu-data'
import MenuRoot from '@/components/menu/menu-root'

// Always read fresh from the DB so dashboard edits go live on reload.
export const dynamic = 'force-dynamic'

export default async function Page() {
  const { menu, strings } = await getMenuData()
  return <MenuRoot menu={menu} strings={strings} />
}
