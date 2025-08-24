import { render, screen } from '@testing-library/react'
import { Skeleton, PostCardSkeleton, PostListSkeleton } from '@/components/ui/Skeleton'

describe('Skeleton Components', () => {
  describe('Skeleton', () => {
    it('renders with default classes', () => {
      render(<Skeleton data-testid="skeleton" />)
      const skeleton = screen.getByTestId('skeleton')
      
      expect(skeleton).toBeInTheDocument()
      expect(skeleton).toHaveClass('animate-pulse', 'rounded-md')
    })

    it('applies custom className', () => {
      render(<Skeleton className="h-4 w-full" data-testid="skeleton" />)
      const skeleton = screen.getByTestId('skeleton')
      
      expect(skeleton).toHaveClass('h-4', 'w-full')
    })
  })

  describe('PostCardSkeleton', () => {
    it('renders post card skeleton structure', () => {
      render(<PostCardSkeleton />)
      
      // 이미지 영역이 있는지 확인
      const imageArea = document.querySelector('.h-48')
      expect(imageArea).toBeInTheDocument()
      
      // 카테고리, 제목, 요약, 메타 정보 영역이 있는지 확인
      const skeletonElements = document.querySelectorAll('.animate-pulse')
      expect(skeletonElements.length).toBeGreaterThan(5)
    })
  })

  describe('PostListSkeleton', () => {
    it('renders default number of skeleton cards', () => {
      render(<PostListSkeleton />)
      
      const grid = document.querySelector('.grid')
      expect(grid).toBeInTheDocument()
      
      // 기본값 6개의 카드가 렌더링되는지 확인
      const cards = document.querySelectorAll('.bg-white')
      expect(cards).toHaveLength(6)
    })

    it('renders custom number of skeleton cards', () => {
      render(<PostListSkeleton count={3} />)
      
      const cards = document.querySelectorAll('.bg-white')
      expect(cards).toHaveLength(3)
    })
  })
})