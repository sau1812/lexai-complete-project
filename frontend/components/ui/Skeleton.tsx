interface SkeletonProps {
  className?: string
}

function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-gradient-to-r from-cream-dark via-white to-cream-dark bg-[length:200%_100%] rounded-lg ${className}`} />
  )
}

export function DashboardSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-36 rounded-xl" />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gold/15 p-5">
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-3 w-24" />
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gold/15 overflow-hidden">
        <div className="bg-navy h-12" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-gold/10">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-4 w-24 ml-auto" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-8 w-16 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function AnalysisSkeleton() {
  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      {/* Sidebar skeleton */}
      <div className="w-72 bg-navy p-5 flex-shrink-0">
        <Skeleton className="h-4 w-32 mb-6 opacity-20" />
        <div className="bg-white/5 border border-gold/20 rounded-xl p-4 mb-5">
          <Skeleton className="h-7 w-7 mb-2 opacity-30" />
          <Skeleton className="h-4 w-40 mb-2 opacity-20" />
          <Skeleton className="h-5 w-20 rounded-full opacity-20" />
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="mb-3">
            <div className="flex justify-between mb-1">
              <Skeleton className="h-3 w-16 opacity-20" />
              <Skeleton className="h-3 w-8 opacity-20" />
            </div>
            <Skeleton className="h-1.5 w-full rounded-full opacity-20" />
          </div>
        ))}
      </div>

      {/* Main skeleton */}
      <div className="flex-1 p-6">
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-40 mb-6" />

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gold/20 pb-0">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-20" />
          ))}
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-3 gap-4 mb-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gold/15 p-5 text-center">
              <Skeleton className="h-10 w-12 mx-auto mb-2" />
              <Skeleton className="h-3 w-20 mx-auto" />
            </div>
          ))}
        </div>

        {/* Summary box */}
        <div className="bg-white rounded-xl border border-gold/15 p-5 mb-5">
          <Skeleton className="h-5 w-40 mb-3" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-5/6 mb-2" />
          <Skeleton className="h-4 w-4/6" />
        </div>

        {/* Clause cards */}
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gold/15 p-5 mb-3">
            <div className="flex justify-between mb-3">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Skeleton
