import type { backendInterface, UserRole } from "../backend";
import { UserRole as UserRoleEnum } from "../backend";

const pythonSubjectId = BigInt(1);
const jsSubjectId = BigInt(2);

export const mockBackend: backendInterface = {
  assignCallerUserRole: async () => undefined,
  _initializeAccessControl: async () => undefined,

  createQuestion: async (payload) => ({
    id: BigInt(10),
    createdAt: BigInt(Date.now()),
    text: payload.text,
    subjectId: payload.subjectId,
    correctOptionIndex: payload.correctOptionIndex,
    options: payload.options,
  }),

  createSubject: async (payload) => ({
    id: BigInt(3),
    name: payload.name,
    createdAt: BigInt(Date.now()),
    description: payload.description,
  }),

  deleteQuestion: async () => true,

  deleteSubject: async () => true,

  getAllAttempts: async () => [
    {
      id: BigInt(1),
      completedAt: BigInt(Date.now() - 3600000),
      startedAt: BigInt(Date.now() - 7200000),
      answers: [BigInt(0), BigInt(1), BigInt(2)],
      completed: true,
      studentPrincipal: { _isPrincipal: true, toText: () => "2vxsx-fae" } as any,
      score: BigInt(80),
      scorePercentage: BigInt(80),
      totalQuestions: BigInt(5),
      subjectId: pythonSubjectId,
    },
    {
      id: BigInt(2),
      completedAt: BigInt(Date.now() - 1800000),
      startedAt: BigInt(Date.now() - 3600000),
      answers: [BigInt(1), BigInt(0)],
      completed: true,
      studentPrincipal: { _isPrincipal: true, toText: () => "3xwpq-abc" } as any,
      score: BigInt(60),
      scorePercentage: BigInt(60),
      totalQuestions: BigInt(4),
      subjectId: jsSubjectId,
    },
  ],

  getCallerUserRole: async () => UserRoleEnum.admin,

  getMyAttempts: async () => [
    {
      id: BigInt(1),
      completedAt: BigInt(Date.now() - 3600000),
      startedAt: BigInt(Date.now() - 7200000),
      answers: [BigInt(0), BigInt(1), BigInt(2)],
      completed: true,
      studentPrincipal: { _isPrincipal: true, toText: () => "2vxsx-fae" } as any,
      score: BigInt(4),
      scorePercentage: BigInt(80),
      totalQuestions: BigInt(5),
      subjectId: pythonSubjectId,
    },
    {
      id: BigInt(2),
      completedAt: BigInt(Date.now() - 1800000),
      startedAt: BigInt(Date.now() - 3600000),
      answers: [BigInt(0), BigInt(1), BigInt(0), BigInt(1)],
      completed: true,
      studentPrincipal: { _isPrincipal: true, toText: () => "2vxsx-fae" } as any,
      score: BigInt(3),
      scorePercentage: BigInt(75),
      totalQuestions: BigInt(4),
      subjectId: jsSubjectId,
    },
  ],

  getMyProfile: async () => ({
    principal: { _isPrincipal: true, toText: () => "2vxsx-fae" } as any,
    displayName: "Alex Johnson",
    accentColor: "",
    registeredAt: BigInt(Date.now() - 86400000 * 30),
    department: "Computer Science",
    registerNumber: "CS2021001",
    enrollNumber: "EN2021001",
    section: "A",
  }),

  isCallerAdmin: async () => true,

  listAllStudents: async () => [
    {
      principal: { _isPrincipal: true, toText: () => "2vxsx-fae" } as any,
      displayName: "Alex Johnson",
      totalAttempts: BigInt(5),
      averageScore: BigInt(78),
    },
    {
      principal: { _isPrincipal: true, toText: () => "3xwpq-abc" } as any,
      displayName: "Maria Garcia",
      totalAttempts: BigInt(3),
      averageScore: BigInt(92),
    },
    {
      principal: { _isPrincipal: true, toText: () => "4yzrs-xyz" } as any,
      displayName: "David Chen",
      totalAttempts: BigInt(7),
      averageScore: BigInt(65),
    },
  ],

  listQuestionsBySubject: async (subjectId) => [
    {
      id: BigInt(1),
      createdAt: BigInt(Date.now() - 86400000),
      text: "Which keyword is used to define a function in Python?",
      subjectId,
      options: ["func", "def", "function", "fn"],
    },
    {
      id: BigInt(2),
      createdAt: BigInt(Date.now() - 86400000),
      text: "What does the `typeof` operator return for an array in JavaScript?",
      subjectId,
      options: ["array", "list", "object", "undefined"],
    },
    {
      id: BigInt(3),
      createdAt: BigInt(Date.now() - 86400000),
      text: "Which of the following is a valid TypeScript generic constraint?",
      subjectId,
      options: ["T extends any", "T instanceof Object", "T extends object", "T of type"],
    },
  ],

  listQuestionsWithAnswers: async (subjectId) => [
    {
      id: BigInt(1),
      createdAt: BigInt(Date.now() - 86400000),
      text: "Which keyword is used to define a function in Python?",
      subjectId,
      correctOptionIndex: BigInt(1),
      options: ["func", "def", "function", "fn"],
    },
    {
      id: BigInt(2),
      createdAt: BigInt(Date.now() - 86400000),
      text: "What does the `typeof` operator return for an array in JavaScript?",
      subjectId,
      correctOptionIndex: BigInt(2),
      options: ["array", "list", "object", "undefined"],
    },
  ],

  listSubjects: async () => [
    {
      id: pythonSubjectId,
      name: "Python",
      createdAt: BigInt(Date.now() - 86400000 * 60),
      description: "Python programming fundamentals and data structures",
      questionCount: BigInt(12),
    },
    {
      id: jsSubjectId,
      name: "JavaScript",
      createdAt: BigInt(Date.now() - 86400000 * 50),
      description: "JavaScript language features, DOM, and async patterns",
      questionCount: BigInt(10),
    },
    {
      id: BigInt(3),
      name: "TypeScript",
      createdAt: BigInt(Date.now() - 86400000 * 40),
      description: "TypeScript type system, generics, and tooling",
      questionCount: BigInt(8),
    },
    {
      id: BigInt(4),
      name: "Java",
      createdAt: BigInt(Date.now() - 86400000 * 35),
      description: "Object-oriented programming with Java and the JVM",
      questionCount: BigInt(9),
    },
    {
      id: BigInt(5),
      name: "Go",
      createdAt: BigInt(Date.now() - 86400000 * 25),
      description: "Go concurrency, goroutines, and standard library",
      questionCount: BigInt(7),
    },
    {
      id: BigInt(6),
      name: "Rust",
      createdAt: BigInt(Date.now() - 86400000 * 20),
      description: "Rust ownership, lifetimes, and systems programming",
      questionCount: BigInt(6),
    },
    {
      id: BigInt(7),
      name: "C++",
      createdAt: BigInt(Date.now() - 86400000 * 15),
      description: "C++ memory management, STL, and modern C++ features",
      questionCount: BigInt(8),
    },
  ],

  registerStudent: async () => ({
    principal: { _isPrincipal: true, toText: () => "2vxsx-fae" } as any,
    displayName: "New Student",
    accentColor: "",
    registeredAt: BigInt(Date.now()),
    department: "Computer Science",
    registerNumber: "CS2021001",
    enrollNumber: "EN2021001",
    section: "A",
  }),

  startQuiz: async (subjectId) => ({
    id: BigInt(99),
    startedAt: BigInt(Date.now()),
    answers: [],
    completed: false,
    studentPrincipal: { _isPrincipal: true, toText: () => "2vxsx-fae" } as any,
    score: BigInt(0),
    scorePercentage: BigInt(0),
    totalQuestions: BigInt(3),
    subjectId,
  }),

  submitQuizAnswers: async (payload) => ({
    attempt: {
      id: payload.attemptId,
      completedAt: BigInt(Date.now()),
      startedAt: BigInt(Date.now() - 300000),
      answers: payload.answers,
      completed: true,
      studentPrincipal: { _isPrincipal: true, toText: () => "2vxsx-fae" } as any,
      score: BigInt(2),
      scorePercentage: BigInt(67),
      totalQuestions: BigInt(3),
      subjectId: pythonSubjectId,
    },
    correctAnswers: [BigInt(1), BigInt(2), BigInt(2)],
  }),

  getAttemptDetails: async (attemptId) => ({
    attempt: {
      id: attemptId,
      completedAt: BigInt(Date.now() - 3600000),
      startedAt: BigInt(Date.now() - 7200000),
      answers: [BigInt(0), BigInt(1), BigInt(2)],
      completed: true,
      studentPrincipal: { _isPrincipal: true, toText: () => "2vxsx-fae" } as any,
      score: BigInt(4),
      scorePercentage: BigInt(80),
      totalQuestions: BigInt(5),
      subjectId: pythonSubjectId,
    },
    correctAnswers: [BigInt(0), BigInt(1), BigInt(2)],
  }),

  getAttemptsByStudent: async () => [],

  getAttemptsBySubject: async () => [],

  getLeaderboard: async () => [
    {
      principal: { _isPrincipal: true, toText: () => "2vxsx-fae" } as any,
      displayName: "Maria Garcia",
      rank: BigInt(1),
      totalAttempts: BigInt(3),
      averageScore: BigInt(92),
    },
    {
      principal: { _isPrincipal: true, toText: () => "2vxsx-fae" } as any,
      displayName: "Alex Johnson",
      rank: BigInt(2),
      totalAttempts: BigInt(5),
      averageScore: BigInt(78),
    },
    {
      principal: { _isPrincipal: true, toText: () => "4yzrs-xyz" } as any,
      displayName: "David Chen",
      rank: BigInt(3),
      totalAttempts: BigInt(7),
      averageScore: BigInt(65),
    },
  ],

  getCertificates: async () => [
    {
      id: BigInt(1),
      completedAt: BigInt(Date.now() - 86400000),
      studentId: { _isPrincipal: true, toText: () => "2vxsx-fae" } as any,
      studentName: "Alex Johnson",
      subjectName: "Python",
      score: BigInt(10),
      totalQuestions: BigInt(12),
      subjectId: BigInt(1),
    },
  ],

  getSubjectCertificate: async (_subjectId) => ({
    id: BigInt(1),
    completedAt: BigInt(Date.now() - 86400000),
    studentId: { _isPrincipal: true, toText: () => "2vxsx-fae" } as any,
    studentName: "Alex Johnson",
    subjectName: "Python",
    score: BigInt(10),
    totalQuestions: BigInt(12),
    subjectId: BigInt(1),
  }),

  updateMyAccentColor: async () => true,
  updateMyDisplayName: async () => true,
  updateMyDepartment: async () => true,
  updateMyEnrollNumber: async () => true,
  updateMyRegisterNumber: async () => true,
  updateMySection: async () => true,

  updateQuestion: async () => true,

  updateSubject: async () => true,

};
