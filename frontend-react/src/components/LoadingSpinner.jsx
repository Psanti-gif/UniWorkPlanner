export function LoadingSpinner({ size = 'md', className = '' }) {
  const s = { sm: 'w-4 h-4', md: 'w-7 h-7', lg: 'w-10 h-10' }[size]
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`${s} border-2 border-border border-t-primary rounded-full animate-spin`} />
    </div>
  )
}

export function PageLoader() {
  return (
    <div className="space-y-3 animate-fade-in">
      <Skeleton className="h-7 w-48" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
      <Skeleton className="h-32" />
      <Skeleton className="h-48" />
    </div>
  )
}

export function Skeleton({ className = '' }) {
  return <div className={`skeleton ${className}`} />
}
