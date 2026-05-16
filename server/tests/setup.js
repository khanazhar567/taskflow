// Environment variables required by the app during tests
process.env.JWT_SECRET = 'test-jwt-secret-for-unit-tests';
process.env.MONGO_URI = 'mongodb://localhost:27017/taskflow_test'; // overridden by memory server per test file
