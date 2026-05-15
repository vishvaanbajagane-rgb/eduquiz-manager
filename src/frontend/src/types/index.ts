import type {
  AttemptDetails,
  AttemptId,
  CreateQuestionPayload,
  CreateSubjectPayload,
  Question,
  QuestionId,
  QuestionPublic,
  QuizAttemptPublic,
  StudentProfilePublic,
  StudentSummary,
  Subject,
  SubjectId,
  SubjectWithStats,
  SubmitAnswersPayload,
  UpdateQuestionPayload,
  UpdateSubjectPayload,
  UserRole,
} from "@/backend";
import type { Principal } from "@icp-sdk/core/principal";

export type { Principal };
export type {
  AttemptDetails,
  Subject,
  SubjectWithStats,
  Question,
  QuestionPublic,
  QuizAttemptPublic,
  StudentSummary,
  StudentProfilePublic,
  SubjectId,
  QuestionId,
  AttemptId,
  CreateSubjectPayload,
  UpdateSubjectPayload,
  CreateQuestionPayload,
  UpdateQuestionPayload,
  SubmitAnswersPayload,
  UserRole,
};

export type UserRoleType = "admin" | "student" | "loading" | "unauthenticated";

export interface NavItem {
  label: string;
  path: string;
  icon?: string;
}
