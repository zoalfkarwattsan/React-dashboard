import axios from 'axios'
// import MockAdapter from 'axios-mock-adapter';

// This is the expected JSON structure (not the exact values, just the keys)
const expectedStructure = {
  message: expect.any(String),
  data: {
    app: {
      langs: expect.any(Array),
      date_format: expect.any(String)
    }
  }
}

describe('API response structure', () => {
  // let mock;
  //
  // beforeAll(() => {
  //   // This sets up the mock adapter on the default instance
  //   mock = new MockAdapter(axios);
  // });
  //
  // afterAll(() => {
  //   // Restore the default adapter
  //   mock.restore();
  // });

  it('should return the correct JSON structure', async () => {
    // Mock the API endpoint with some dummy data
    // mock.onGet('/api/your-endpoint').reply(200, {
    //   message: '',
    //   data: {
    //     app: {
    //       langs: ['ar', 'en'],
    //       date_format: 'Y-m-d',
    //     },
    //   },
    // });

    // Make the API call
    const response = await axios.get(`http://localhost/livestock/api/setting/all`)

    // Check the structure of the response
    expect(response.data).toEqual(expectedStructure)
  })
})