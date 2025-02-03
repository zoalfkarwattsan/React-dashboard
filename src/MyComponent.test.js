// MyComponent.test.js
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import MyComponent from './MyComponent'

test('fetches and displays data', async () => {
    render(<MyComponent />)

    // Check if the loading text is displayed initially
    expect(screen.getByText('Loading...')).toBeInTheDocument()

    // Wait for the data to be fetched and displayed
    await waitFor(() => expect(screen.getByText('Mocked data')).toBeInTheDocument())
})
