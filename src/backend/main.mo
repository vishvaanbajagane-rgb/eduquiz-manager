import Map "mo:core/Map";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import CommonTypes "types/common";
import _SubjectTypes "types/subjects";
import _QuestionTypes "types/questions";
import _QuizTypes "types/quiz";
import _StudentTypes "types/students";
import SubjectsLib "lib/subjects";
import QuestionsLib "lib/questions";
import QuizLib "lib/quiz";
import StudentsLib "lib/students";
import SubjectsMixin "mixins/subjects-api";
import QuestionsMixin "mixins/questions-api";
import QuizMixin "mixins/quiz-api";
import StudentsMixin "mixins/students-api";
import Time "mo:core/Time";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let subjects = Map.empty<CommonTypes.SubjectId, SubjectsLib.Subject>();
  let questions = Map.empty<CommonTypes.QuestionId, QuestionsLib.Question>();
  let attempts = Map.empty<CommonTypes.AttemptId, QuizLib.QuizAttempt>();
  let students = Map.empty<CommonTypes.UserId, StudentsLib.StudentProfile>();

  let state = {
    var nextSubjectId : Nat = 0;
    var nextQuestionId : Nat = 0;
    var nextAttemptId : Nat = 0;
  };

  // Pre-populate programming language subjects on first deploy
  if (subjects.size() == 0) {
    let langs = ["Python", "JavaScript", "TypeScript", "Java", "Go", "Rust", "C++"];
    for (lang in langs.values()) {
      let id = state.nextSubjectId;
      state.nextSubjectId += 1;
      subjects.add(id, {
        id;
        name = lang;
        description = lang # " programming language quiz";
        createdAt = Time.now();
      });
    };
  };

  include SubjectsMixin(accessControlState, subjects, questions, state);
  include QuestionsMixin(accessControlState, questions, state);
  include QuizMixin(accessControlState, attempts, questions, state);
  include StudentsMixin(accessControlState, students, attempts);
};
