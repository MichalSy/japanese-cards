export default function CategoryCardSkeleton() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--spacing-4)',
      padding: 'var(--spacing-4)',
      backgroundColor: 'var(--color-surface)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--color-surface-light)',
    }}>
      {/* Icon Skeleton */}
      <div className="skeleton" style={{
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        flexShrink: 0,
      }} />

      {/* Text Skeleton */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
        {/* Title Skeleton */}
        <div className="skeleton" style={{
          height: '16px',
          width: '60%',
        }} />

        {/* Subtitle Skeleton */}
        <div className="skeleton" style={{
          height: '12px',
          width: '80%',
        }} />
      </div>

      {/* Arrow Skeleton */}
      <div className="skeleton" style={{
        width: '20px',
        height: '20px',
      }} />
    </div>
  )
}
