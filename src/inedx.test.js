import axios from 'axios'

// Custom matcher to handle string or null
const stringOrNull = expect.stringMatching(/.*/)

// This is the expected JSON structure (not the exact values, just the keys)
const expectedStructure = {
    success: expect.any(Boolean),
    message: expect.any(String),
    status: expect.any(Number),
    code: expect.any(Number),
    data: {
        id: expect.any(Number),
        name: expect.any(String),
        guard_name: expect.any(String),
        locked: expect.any(Number),
        description: null,
        created_at: expect.any(String),
        updated_at: expect.any(String),
        permissions: expect.any(Array)
    }
}

describe('API POST request and response structure', () => {

    it('should send a POST request and return the correct JSON structure', async () => {


        const authResponse = await axios.post('http://localhost/livestock/api/dashboard/login', {email: "admin@admin.com", password: "admin_admin"})

        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authResponse.data.data.token}`
        }

        const response = await axios.post('http://localhost/livestock/api/roles', {name: "Test Role"}, {headers})

        // console.log(response)

        // Check the structure of the response
        expect(response.data).toEqual(expectedStructure)
    })
})