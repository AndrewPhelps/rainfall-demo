export interface CallToAction {
  text: string
  url: string
}

export interface Event {
  id: string
  title: string
  date: string
  description: string
  address: string
  location: [number, number]
  images: string[]
  video_file: string | null
  video_link: string
  product_line?: string
}

export interface Merchant {
  slug: string
  name: string
  logo_light: string | null
  logo_dark: string | null
}

export interface Asset {
  id: string
  name: string
  serial: string
  is_owner: boolean
  merchant: Merchant
  image_url: string
  attributes: {
    [key: string]: { name: string; value: string }
  }
  featured_event?: {
    id: string
    title: string
    description: string
  }
  events: Event[]
  verify_url: string
  call_to_action?: CallToAction[]
  is_claimable?: boolean
  has_pin?: boolean
}
