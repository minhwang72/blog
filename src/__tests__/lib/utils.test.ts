import { cn } from '@/lib/utils'

describe('utils', () => {
  describe('cn', () => {
    it('should merge class names correctly', () => {
      expect(cn('px-4', 'py-2')).toBe('px-4 py-2')
    })

    it('should handle conditional classes', () => {
      expect(cn('base', true && 'active', false && 'disabled')).toBe('base active')
    })

    it('should handle undefined and null values', () => {
      expect(cn('base', undefined, null, 'active')).toBe('base active')
    })

    it('should merge Tailwind classes correctly', () => {
      expect(cn('px-4 py-2', 'px-6')).toBe('py-2 px-6')
    })
  })
})