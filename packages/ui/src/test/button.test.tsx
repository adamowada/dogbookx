import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Button } from '../components/button'

describe('Button', () => {
  it('renders an accessible button', () => {
    render(<Button>Post update</Button>)

    expect(screen.getByRole('button', { name: /post update/i })).toBeInTheDocument()
  })
})
