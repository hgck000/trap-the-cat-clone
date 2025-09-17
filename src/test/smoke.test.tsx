import { render, screen } from '@testing-library/react'
import { test, expect } from 'vitest'

function Hello() {
  return <h1>Hello Test</h1>
}

test('renders Hello Test', () => {
  render(<Hello />)
  expect(screen.getByText('Hello Test')).toBeInTheDocument()
})
