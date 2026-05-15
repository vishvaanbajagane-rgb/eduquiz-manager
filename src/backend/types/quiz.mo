import Types "common";

module {
  public type QuizAttempt = {
    id : Types.AttemptId;
    studentPrincipal : Types.UserId;
    subjectId : Types.SubjectId;
    var answers : [Nat];
    var completed : Bool;
    var score : Nat;
    totalQuestions : Nat;
    startedAt : Types.Timestamp;
    var completedAt : ?Types.Timestamp;
  };

  public type QuizAttemptPublic = {
    id : Types.AttemptId;
    studentPrincipal : Types.UserId;
    subjectId : Types.SubjectId;
    answers : [Nat];
    completed : Bool;
    score : Nat;
    scorePercentage : Nat;
    totalQuestions : Nat;
    startedAt : Types.Timestamp;
    completedAt : ?Types.Timestamp;
  };

  public type AttemptDetails = {
    attempt : QuizAttemptPublic;
    correctAnswers : [Nat];
  };

  public type SubmitAnswersPayload = {
    attemptId : Types.AttemptId;
    answers : [Nat];
  };

  public type SubmitQuizResult = {
    attempt : QuizAttemptPublic;
    correctAnswers : [Nat];
  };
};
