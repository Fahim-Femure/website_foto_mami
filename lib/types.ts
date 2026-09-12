export interface Photo {
  id: string
  guest_name: string | null
  photo_url: string
  thumbnail_url: string | null
  created_at: string
  is_approved: boolean
}
