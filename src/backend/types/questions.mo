import Types "common";

module {
  public type Question = {
    id : Types.QuestionId;
    subjectId : Types.SubjectId;
    text : Text;
    options : [Text];
    correctOptionIndex : Nat;
    createdAt : Types.Timestamp;
  };

  public type QuestionPublic = {
    id : Types.QuestionId;
    subjectId : Types.SubjectId;
    text : Text;
    options : [Text];
    createdAt : Types.Timestamp;
  };

  public type CreateQuestionPayload = {
    subjectId : Types.SubjectId;
    text : Text;
    options : [Text];
    correctOptionIndex : Nat;
  };

  public type UpdateQuestionPayload = {
    id : Types.QuestionId;
    subjectId : Types.SubjectId;
    text : Text;
    options : [Text];
    correctOptionIndex : Nat;
  };
};
