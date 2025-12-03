import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  collectCoverage: false,
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  moduleNameMapper: {
    'src/(.*)': '<rootDir>/src/$1'
  }
};

export default config;
