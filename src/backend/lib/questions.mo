import Map "mo:core/Map";
import Time "mo:core/Time";
import QuestionTypes "../types/questions";
import CommonTypes "../types/common";

module {
  public type Question = QuestionTypes.Question;
  public type QuestionPublic = QuestionTypes.QuestionPublic;

  public func create(
    questions : Map.Map<CommonTypes.QuestionId, Question>,
    state : { var nextQuestionId : Nat },
    payload : QuestionTypes.CreateQuestionPayload,
  ) : Question {
    let id = state.nextQuestionId;
    state.nextQuestionId += 1;
    let question : Question = {
      id;
      subjectId = payload.subjectId;
      text = payload.text;
      options = payload.options;
      correctOptionIndex = payload.correctOptionIndex;
      createdAt = Time.now();
    };
    questions.add(id, question);
    question;
  };

  public func listBySubject(
    questions : Map.Map<CommonTypes.QuestionId, Question>,
    subjectId : CommonTypes.SubjectId,
  ) : [Question] {
    questions.values().filter<Question>(
      func(q) { q.subjectId == subjectId },
    ).toArray();
  };

  public func listPublicBySubject(
    questions : Map.Map<CommonTypes.QuestionId, Question>,
    subjectId : CommonTypes.SubjectId,
  ) : [QuestionPublic] {
    questions.values().filter<Question>(
      func(q) { q.subjectId == subjectId },
    ).map<Question, QuestionPublic>(
      func(q) {
        {
          id = q.id;
          subjectId = q.subjectId;
          text = q.text;
          options = q.options;
          createdAt = q.createdAt;
        };
      },
    ).toArray();
  };

  public func update(
    questions : Map.Map<CommonTypes.QuestionId, Question>,
    payload : QuestionTypes.UpdateQuestionPayload,
  ) : Bool {
    switch (questions.get(payload.id)) {
      case null false;
      case (?existing) {
        questions.add(
          payload.id,
          {
            existing with
            subjectId = payload.subjectId;
            text = payload.text;
            options = payload.options;
            correctOptionIndex = payload.correctOptionIndex;
          },
        );
        true;
      };
    };
  };

  public func remove(
    questions : Map.Map<CommonTypes.QuestionId, Question>,
    id : CommonTypes.QuestionId,
  ) : Bool {
    switch (questions.get(id)) {
      case null false;
      case (?_) {
        questions.remove(id);
        true;
      };
    };
  };

  public func countBySubject(
    questions : Map.Map<CommonTypes.QuestionId, Question>,
    subjectId : CommonTypes.SubjectId,
  ) : Nat {
    questions.values().filter<Question>(
      func(q) { q.subjectId == subjectId },
    ).size();
  };
};
