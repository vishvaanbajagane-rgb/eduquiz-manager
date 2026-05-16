import Map "mo:core/Map";
import AccessControl "mo:caffeineai-authorization/access-control";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import QuizTypes "../types/quiz";
import QuestionTypes "../types/questions";
import CommonTypes "../types/common";
import QuizLib "../lib/quiz";
import CertsLib "../lib/certificates";
import StudentsLib "../lib/students";
import SubjectTypes "../types/subjects";
import Time "mo:core/Time";
import Nat "mo:core/Nat";

mixin (
  accessControlState : AccessControl.AccessControlState,
  attempts : Map.Map<CommonTypes.AttemptId, QuizLib.QuizAttempt>,
  questions : Map.Map<CommonTypes.QuestionId, QuestionTypes.Question>,
  subjects : Map.Map<CommonTypes.SubjectId, SubjectTypes.Subject>,
  certificates : Map.Map<CommonTypes.CertificateId, CertsLib.Certificate>,
  students : Map.Map<CommonTypes.UserId, StudentsLib.StudentProfile>,
  state : { var nextAttemptId : Nat; var nextCertificateId : Nat },
) {
  public shared ({ caller }) func startQuiz(subjectId : CommonTypes.SubjectId) : async QuizTypes.QuizAttemptPublic {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: must be logged in to start a quiz");
    };
    let totalQuestions = questions.values().filter(
      func(q : QuestionTypes.Question) : Bool { q.subjectId == subjectId },
    ).size();
    let timeLimitMinutes : ?Nat = switch (subjects.get(subjectId)) {
      case (?s) s.timerMinutes;
      case null null;
    };
    QuizLib.start(attempts, state, questions, caller, subjectId, totalQuestions, timeLimitMinutes);
  };

  public shared ({ caller }) func submitQuizAnswers(payload : QuizTypes.SubmitAnswersPayload) : async QuizTypes.SubmitQuizResult {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: must be logged in to submit answers");
    };
    let result = QuizLib.submitAnswers(attempts, questions, payload, caller);
    // Auto-generate certificate if student has completed all questions in subject
    let attempt = result.attempt;
    let subjectId = attempt.subjectId;
    // Count total questions for this subject
    let totalSubjectQuestions = questions.values().filter(
      func(q : QuestionTypes.Question) : Bool { q.subjectId == subjectId },
    ).size();
    // Issue certificate if: attempt covers all questions AND student hasn't earned one yet
    if (
      totalSubjectQuestions > 0 and
      attempt.totalQuestions == totalSubjectQuestions and
      not CertsLib.hasCompleted(certificates, caller, subjectId)
    ) {
      let subjectName = switch (subjects.get(subjectId)) {
        case (?s) s.name;
        case null "";
      };
      let studentName = switch (students.get(caller)) {
        case (?p) p.displayName;
        case null caller.toText();
      };
      ignore CertsLib.issue(
        certificates,
        state,
        caller,
        subjectId,
        studentName,
        subjectName,
        Time.now(),
        attempt.score,
        attempt.totalQuestions,
      );
    };
    result;
  };

  public query ({ caller }) func getMyAttempts() : async [QuizTypes.QuizAttemptPublic] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: must be logged in");
    };
    QuizLib.listByStudent(attempts, caller);
  };

  public query ({ caller }) func getAllAttempts() : async [QuizTypes.QuizAttemptPublic] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: only admins can view all attempts");
    };
    QuizLib.listAll(attempts);
  };

  public query ({ caller }) func getAttemptDetails(attemptId : CommonTypes.AttemptId) : async ?QuizTypes.AttemptDetails {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: must be logged in");
    };
    QuizLib.getDetails(attempts, questions, attemptId);
  };

  public query ({ caller }) func getAttemptsBySubject(subjectId : CommonTypes.SubjectId) : async [QuizTypes.QuizAttemptPublic] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: only admins can filter attempts by subject");
    };
    QuizLib.listBySubject(attempts, subjectId);
  };

  public query ({ caller }) func getAttemptsByStudent(studentId : CommonTypes.UserId) : async [QuizTypes.QuizAttemptPublic] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: only admins can filter attempts by student");
    };
    QuizLib.listByStudent(attempts, studentId);
  };
};
