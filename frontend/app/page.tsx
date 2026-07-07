import Navbar from '@/components/layout/Navbar'
import UploadZone from '@/components/analysis/UploadZone'
import HomeFeatures from '@/components/layout/HomeFeatures'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <HomeFeatures />
    </div>
  )
}