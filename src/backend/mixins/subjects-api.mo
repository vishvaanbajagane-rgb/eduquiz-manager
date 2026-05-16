import Map "mo:core/Map";
import AccessControl "mo:caffeineai-authorization/access-control";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import SubjectTypes "../types/subjects";
import CommonTypes "../types/common";
import SubjectsLib "../lib/subjects";
import QuestionsLib "../lib/questions";
import Nat "mo:core/Nat";

mixin (
  accessControlState : AccessControl.AccessControlState,
  subjects : Map.Map<CommonTypes.SubjectId, SubjectsLib.Subject>,
  questions : Map.Map<CommonTypes.QuestionId, QuestionsLib.Question>,
  state : { var nextSubjectId : Nat },
) {
  public query func listSubjects() : async [SubjectTypes.SubjectWithStats] {
    // Build a count-per-subject map from questions
    let countMap = Map.empty<CommonTypes.SubjectId, Nat>();
    for ((_, q) in questions.entries()) {
      let prev = switch (countMap.get(q.subjectId)) {
        case (?c) c;
        case null 0;
      };
      countMap.add(q.subjectId, prev + 1);
    };
    SubjectsLib.listWithStats(subjects, countMap);
  };

  public shared ({ caller }) func createSubject(payload : SubjectTypes.CreateSubjectPayload) : async SubjectTypes.Subject {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: only admins can create subjects");
    };
    SubjectsLib.create(subjects, state, payload);
  };

  public shared ({ caller }) func updateSubject(payload : SubjectTypes.UpdateSubjectPayload) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: only admins can update subjects");
    };
    SubjectsLib.update(subjects, payload);
  };

  public shared ({ caller }) func deleteSubject(id : CommonTypes.SubjectId) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: only admins can delete subjects");
    };
    // Remove all questions belonging to this subject
    let questionIds = questions.entries().filter(
      func((_, q) : (CommonTypes.QuestionId, QuestionsLib.Question)) : Bool { q.subjectId == id },
    ).map(
      func((qId, _)) { qId },
    ).toArray();
    for (qId in questionIds.values()) {
      questions.remove(qId);
    };
    SubjectsLib.remove(subjects, id);
  };
};
