export function LoadingSpinner({ size = 'md', className = '' }) {
  const s = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' }[size]
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`${s} border-2 border-primary/20 border-t-primary rounded-full animate-spin`} />
    </div>
  )
}

export function PageLoader() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[300px]">
      <LoadingSpinner size="lg" />
    </div>
  )
}
