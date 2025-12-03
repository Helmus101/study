// Test setup file
import 'dotenv/config';

// Mock OpenAI for testing
jest.mock('openai', () => {
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn(),
      },
    },
    moderations: {
      create: jest.fn(),
    },
    models: {
      list: jest.fn(),
    },
  }));
});

// Set test environment variables
process.env.OPENAI_API_KEY = 'test-api-key';
process.env.NODE_ENV = 'test';