import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface CreateQuestionPayload {
    text: string;
    subjectId: SubjectId;
    correctOptionIndex: bigint;
    options: Array<string>;
}
export type Timestamp = bigint;
export interface StudentProfilePublic {
    principal: UserId;
    displayName: string;
    registeredAt: Timestamp;
}
export type AttemptId = bigint;
export interface UpdateQuestionPayload {
    id: QuestionId;
    text: string;
    subjectId: SubjectId;
    correctOptionIndex: bigint;
    options: Array<string>;
}
export interface QuestionPublic {
    id: QuestionId;
    createdAt: Timestamp;
    text: string;
    subjectId: SubjectId;
    options: Array<string>;
}
export type QuestionId = bigint;
export interface CreateSubjectPayload {
    name: string;
    description: string;
}
export interface SubmitAnswersPayload {
    attemptId: AttemptId;
    answers: Array<bigint>;
}
export interface AttemptDetails {
    attempt: QuizAttemptPublic;
    correctAnswers: Array<bigint>;
}
export type UserId = Principal;
export interface UpdateSubjectPayload {
    id: SubjectId;
    name: string;
    description: string;
}
export interface SubjectWithStats {
    id: SubjectId;
    name: string;
    createdAt: Timestamp;
    description: string;
    questionCount: bigint;
}
export interface QuizAttemptPublic {
    id: AttemptId;
    completedAt?: Timestamp;
    startedAt: Timestamp;
    answers: Array<bigint>;
    completed: boolean;
    studentPrincipal: UserId;
    scorePercentage: bigint;
    score: bigint;
    totalQuestions: bigint;
    subjectId: SubjectId;
}
export interface SubmitQuizResult {
    attempt: QuizAttemptPublic;
    correctAnswers: Array<bigint>;
}
export interface Question {
    id: QuestionId;
    createdAt: Timestamp;
    text: string;
    subjectId: SubjectId;
    correctOptionIndex: bigint;
    options: Array<string>;
}
export type SubjectId = bigint;
export interface Subject {
    id: SubjectId;
    name: string;
    createdAt: Timestamp;
    description: string;
}
export interface StudentSummary {
    principal: UserId;
    displayName: string;
    totalAttempts: bigint;
    averageScore: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createQuestion(payload: CreateQuestionPayload): Promise<Question>;
    createSubject(payload: CreateSubjectPayload): Promise<Subject>;
    deleteQuestion(id: QuestionId): Promise<boolean>;
    deleteSubject(id: SubjectId): Promise<boolean>;
    getAllAttempts(): Promise<Array<QuizAttemptPublic>>;
    getAttemptDetails(attemptId: AttemptId): Promise<AttemptDetails | null>;
    getAttemptsByStudent(studentId: UserId): Promise<Array<QuizAttemptPublic>>;
    getAttemptsBySubject(subjectId: SubjectId): Promise<Array<QuizAttemptPublic>>;
    getCallerUserRole(): Promise<UserRole>;
    getMyAttempts(): Promise<Array<QuizAttemptPublic>>;
    getMyProfile(): Promise<StudentProfilePublic | null>;
    isCallerAdmin(): Promise<boolean>;
    listAllStudents(): Promise<Array<StudentSummary>>;
    listQuestionsBySubject(subjectId: SubjectId): Promise<Array<QuestionPublic>>;
    listQuestionsWithAnswers(subjectId: SubjectId): Promise<Array<Question>>;
    listSubjects(): Promise<Array<SubjectWithStats>>;
    registerStudent(): Promise<StudentProfilePublic>;
    startQuiz(subjectId: SubjectId): Promise<QuizAttemptPublic>;
    submitQuizAnswers(payload: SubmitAnswersPayload): Promise<SubmitQuizResult>;
    updateMyDisplayName(name: string): Promise<boolean>;
    updateQuestion(payload: UpdateQuestionPayload): Promise<boolean>;
    updateSubject(payload: UpdateSubjectPayload): Promise<boolean>;
}
