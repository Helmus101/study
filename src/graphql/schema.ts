import { GraphQLJSONObject } from 'graphql-type-json';
import { PronoteRepository } from '../db/repository';

export const typeDefs = `#graphql
  scalar JSON

  type TaskOrigin {
    system: String!
    category: String!
    referenceId: String!
  }

  type Task {
    id: ID!
    source: String!
    title: String!
    description: String
    dueDate: String
    estimatedMinutes: Int!
    origin: TaskOrigin!
    metadata: JSON!
  }

  type Deadline {
    id: ID!
    label: String!
    dueDate: String!
    metadata: JSON!
  }

  type Grade {
    id: ID!
    subject: String!
    score: Float!
    outOf: Float!
    average: Float
    recordedAt: String!
    metadata: JSON!
  }

  type Lesson {
    id: ID!
    subject: String!
    teacher: String
    room: String
    startTime: String!
    endTime: String!
    metadata: JSON!
  }

  type TimetableEntry {
    id: ID!
    title: String!
    day: String!
    startTime: String!
    endTime: String!
    metadata: JSON!
  }

  type DashboardSummary {
    tasks: [Task!]!
    deadlines: [Deadline!]!
    grades: [Grade!]!
    lessons: [Lesson!]!
    timetable: [TimetableEntry!]!
  }

  type Query {
    tasks: [Task!]!
    dashboardSummary: DashboardSummary!
  }
`;

export const buildResolvers = (repository: PronoteRepository) => ({
  JSON: GraphQLJSONObject,
  Query: {
    tasks: async () => repository.getTasks(),
    dashboardSummary: async () => ({
      tasks: await repository.getTasks(),
      deadlines: await repository.getDeadlines(),
      grades: await repository.getGrades(),
      lessons: await repository.getLessons(),
      timetable: await repository.getTimetable()
    })
  }
});
