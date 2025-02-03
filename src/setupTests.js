// setupTests.js
import { setupServer } from 'msw/node'
import { rest } from 'msw'

// Define the handlers for the mock API
const handlers = [
    rest.get('/api/data', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json({ data: 'Mocked data' })
        )
    })
]

// Set up the server with the handlers
const server = setupServer(...handlers)

// Establish API mocking before all tests
beforeAll(() => server.listen())

// Reset any request handlers that are declared as a part of our tests
// (i.e. for testing one-time error scenarios)
afterEach(() => server.resetHandlers())

// Clean up after the tests are finished
afterAll(() => server.close())
