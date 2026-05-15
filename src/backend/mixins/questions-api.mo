import Map "mo:core/Map";
import AccessControl "mo:caffeineai-authorization/access-control";
import Runtime "mo:core/Runtime";
import QuestionTypes "../types/questions";
import CommonTypes "../types/common";
import QuestionsLib "../lib/questions";

mixin (
  accessControlState : AccessControl.AccessControlState,
  questions : Map.Map<CommonTypes.QuestionId, QuestionsLib.Question>,
  state : { var nextQuestionId : Nat },
) {
  // Admins get full questions (with correct answer); students get public version
  public query ({ caller }) func listQuestionsBySubject(subjectId : CommonTypes.SubjectId) : async [QuestionTypes.QuestionPublic] {
    QuestionsLib.listPublicBySubject(questions, subjectId);
  };

  public query ({ caller }) func listQuestionsWithAnswers(subjectId : CommonTypes.SubjectId) : async [QuestionTypes.Question] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: only admins can view questions with answers");
    };
    QuestionsLib.listBySubject(questions, subjectId);
  };

  public shared ({ caller }) func createQuestion(payload : QuestionTypes.CreateQuestionPayload) : async QuestionTypes.Question {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: only admins can create questions");
    };
    QuestionsLib.create(questions, state, payload);
  };

  public shared ({ caller }) func updateQuestion(payload : QuestionTypes.UpdateQuestionPayload) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: only admins can update questions");
    };
    QuestionsLib.update(questions, payload);
  };

  public shared ({ caller }) func deleteQuestion(id : CommonTypes.QuestionId) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: only admins can delete questions");
    };
    QuestionsLib.remove(questions, id);
  };
};
