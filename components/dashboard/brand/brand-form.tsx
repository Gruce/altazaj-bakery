'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { saveBrand } from '@/app/dashboard/_actions/brand'
import type { BrandRow } from '@/db/schema'

type FormState = Omit<BrandRow, 'id'>

export default function BrandForm({ brand }: { brand: BrandRow }) {
  const router = useRouter()
  const [pending, start] = useTransition()
  const [form, setForm] = useState<FormState>({
    nameAr: brand.nameAr,
    nameEn: brand.nameEn,
    tagAr: brand.tagAr,
    tagEn: brand.tagEn,
    cityAr: brand.cityAr,
    cityEn: brand.cityEn,
    currencyAr: brand.currencyAr,
    currencyEn: brand.currencyEn,
    facebook: brand.facebook,
    instagram: brand.instagram,
    phone: brand.phone,
  })

  const set = (p: Partial<FormState>) => setForm((f) => ({ ...f, ...p }))

  function submit() {
    if (!form.nameAr.trim() || !form.nameEn.trim())
      return toast.error('Brand name (both languages) is required')
    start(async () => {
      try {
        await saveBrand(form)
        toast.success('Brand settings saved')
        router.refresh()
      } catch {
        toast.error('Could not save')
      }
    })
  }

  const field = (
    key: keyof FormState,
    label: string,
    opts: { rtl?: boolean; placeholder?: string } = {},
  ) => (
    <div className="flex flex-col gap-2">
      <Label htmlFor={key}>{label}</Label>
      <Input
        id={key}
        dir={opts.rtl ? 'rtl' : undefined}
        placeholder={opts.placeholder}
        value={form[key] ?? ''}
        onChange={(e) => set({ [key]: e.target.value } as Partial<FormState>)}
      />
    </div>
  )

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Brand &amp; Settings</h1>
          <p className="text-sm text-muted-foreground">
            Name, tagline, currency and socials shown across the menu.
          </p>
        </div>
        <Button onClick={submit} disabled={pending}>
          {pending && <Loader2 className="h-4 w-4 animate-spin" />}
          Save changes
        </Button>
      </div>

      <div className="flex flex-col gap-5">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Identity</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {field('nameAr', 'Name (Arabic)', { rtl: true })}
            {field('nameEn', 'Name (English)')}
            {field('tagAr', 'Tagline (Arabic)', { rtl: true })}
            {field('tagEn', 'Tagline (English)')}
            {field('cityAr', 'City line (Arabic)', { rtl: true })}
            {field('cityEn', 'City line (English)')}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Currency</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {field('currencyAr', 'Currency (Arabic)', { rtl: true, placeholder: 'د.ع' })}
            {field('currencyEn', 'Currency (English)', { placeholder: 'IQD' })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Contact &amp; socials</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {field('facebook', 'Facebook URL', { placeholder: 'https://facebook.com/…' })}
            {field('instagram', 'Instagram URL', { placeholder: 'https://instagram.com/…' })}
            {field('phone', 'Phone', { placeholder: '+964…' })}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
