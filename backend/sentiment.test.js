const request = require('supertest');
const sqlite3 = require('sqlite3');

// Mock the SQLite3 module
jest.mock('sqlite3', () => {
  const mockRun = jest.fn();
  const mockGet = jest.fn();
  const mockClose = jest.fn();

  const mockDatabase = {
    run: mockRun,
    get: mockGet,
    close: mockClose,
  };

  const mockVerbose = jest.fn(() => ({
    Database: jest.fn(() => mockDatabase),
  }));

  return {
    verbose: mockVerbose,
    mockDatabase, // Exporting the mock database for easier access in tests
  };
});

// Import your app (assuming it's exported from index.js)
const app = require('./index');

describe('POST /sentiment', () => {
  let db;

  beforeEach(() => {
    // Reset the mocks before each test
    jest.clearAllMocks();

    db = sqlite3.mockDatabase; // Use the mocked database
  });

  it('should return 400 if text is not provided', async () => {
    const response = await request(app)
      .post('/sentiment')
      .send({});
    
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Text is required');
  });

  it('should return 200 and save the sentiment if text is provided', async () => {
    const text = 'This is a test';
    const fakeId = 1;
    const fakeSentiment = 'positive';

    // Mock the sentiment analysis and database insert function
    db.run.mockImplementation((query, params, callback) => {
      callback(null);
    });
    db.get.mockImplementation((query, params, callback) => {
      callback(null, { id: fakeId, text, sentiment: fakeSentiment });
    });

    const response = await request(app)
      .post('/sentiment')
      .send({ text });

    expect(response.status).toBe(200);

    // Verify the data was saved in the mock database
    expect(db.run).toHaveBeenCalledWith(
      'INSERT INTO sentiments (text, sentiment) VALUES (?, ?)',
      [text, response.body.sentiment],
      expect.any(Function)
    );
  });

  it('should return 500 if there is a database error', async () => {
    const text = 'This is a test';

    // Mock the database to simulate an error
    db.run.mockImplementation((query, params, callback) => {
      callback(new Error('Failed to save data to the database'));
    });

    const response = await request(app)
      .post('/sentiment')
      .send({ text });

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error', 'Failed to save data to the database');
  });
});
