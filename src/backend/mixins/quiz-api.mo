import Map "mo:core/Map";
import AccessControl "mo:caffeineai-authorization/access-control";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import QuizTypes "../types/quiz";
import QuestionTypes "../types/questions";
import CommonTypes "../types/common";
import QuizLib "../lib/quiz";

mixin (
  accessControlState : AccessControl.AccessControlState,
  attempts : Map.Map<CommonTypes.AttemptId, QuizLib.QuizAttempt>,
  questions : Map.Map<CommonTypes.QuestionId, QuestionTypes.Question>,
  state : { var nextAttemptId : Nat },
) {
  public shared ({ caller }) func startQuiz(subjectId : CommonTypes.SubjectId) : async QuizTypes.QuizAttemptPublic {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: must be logged in to start a quiz");
    };
    let totalQuestions = questions.values().filter(
      func(q : QuestionTypes.Question) : Bool { q.subjectId == subjectId },
    ).size();
    QuizLib.start(attempts, state, questions, caller, subjectId, totalQuestions);
  };

  public shared ({ caller }) func submitQuizAnswers(payload : QuizTypes.SubmitAnswersPayload) : async QuizTypes.SubmitQuizResult {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: must be logged in to submit answers");
    };
    QuizLib.submitAnswers(attempts, questions, payload, caller);
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
