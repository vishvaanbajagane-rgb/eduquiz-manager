import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import QuizTypes "../types/quiz";
import QuestionTypes "../types/questions";
import CommonTypes "../types/common";
import Array "mo:core/Array";

module {
  public type QuizAttempt = QuizTypes.QuizAttempt;
  public type QuizAttemptPublic = QuizTypes.QuizAttemptPublic;

  public func toPublic(attempt : QuizAttempt) : QuizAttemptPublic {
    let pct : Nat = if (attempt.totalQuestions == 0) { 0 } else {
      attempt.score * 100 / attempt.totalQuestions
    };
    {
      id = attempt.id;
      studentPrincipal = attempt.studentPrincipal;
      subjectId = attempt.subjectId;
      answers = attempt.answers;
      completed = attempt.completed;
      score = attempt.score;
      scorePercentage = pct;
      totalQuestions = attempt.totalQuestions;
      startedAt = attempt.startedAt;
      completedAt = attempt.completedAt;
    };
  };

  public func start(
    attempts : Map.Map<CommonTypes.AttemptId, QuizAttempt>,
    state : { var nextAttemptId : Nat },
    _questions : Map.Map<CommonTypes.QuestionId, QuestionTypes.Question>,
    studentPrincipal : CommonTypes.UserId,
    subjectId : CommonTypes.SubjectId,
    totalQuestions : Nat,
  ) : QuizAttemptPublic {
    let id = state.nextAttemptId;
    state.nextAttemptId += 1;
    let attempt : QuizAttempt = {
      id;
      studentPrincipal;
      subjectId;
      var answers = [];
      var completed = false;
      var score = 0;
      totalQuestions;
      startedAt = Time.now();
      var completedAt = null;
    };
    attempts.add(id, attempt);
    toPublic(attempt);
  };

  public func submitAnswers(
    attempts : Map.Map<CommonTypes.AttemptId, QuizAttempt>,
    questions : Map.Map<CommonTypes.QuestionId, QuestionTypes.Question>,
    payload : QuizTypes.SubmitAnswersPayload,
    studentPrincipal : CommonTypes.UserId,
  ) : QuizTypes.SubmitQuizResult {
    let attempt = switch (attempts.get(payload.attemptId)) {
      case null Runtime.trap("Attempt not found");
      case (?a) a;
    };
    if (attempt.studentPrincipal != studentPrincipal) {
      Runtime.trap("Unauthorized: not your attempt");
    };
    if (attempt.completed) {
      Runtime.trap("Attempt already completed");
    };
    // Calculate score: count how many submitted answers match the correct option
    let subjectQuestions = questions.values().filter(
      func(q : QuestionTypes.Question) : Bool { q.subjectId == attempt.subjectId },
    ).toArray();
    var correctCount = 0;
    let answerCount = payload.answers.size();
    if (answerCount > 0) {
      var i = 0;
      while (i < answerCount) {
        if (i < subjectQuestions.size()) {
          if (payload.answers[i] == subjectQuestions[i].correctOptionIndex) {
            correctCount += 1;
          };
        };
        i += 1;
      };
    };
    attempt.answers := payload.answers;
    attempt.score := correctCount;
    attempt.completed := true;
    attempt.completedAt := ?Time.now();
    let correctAnswers = subjectQuestions.map(func(q) { q.correctOptionIndex });
    { attempt = toPublic(attempt); correctAnswers };
  };

  public func getDetails(
    attempts : Map.Map<CommonTypes.AttemptId, QuizAttempt>,
    questions : Map.Map<CommonTypes.QuestionId, QuestionTypes.Question>,
    attemptId : CommonTypes.AttemptId,
  ) : ?QuizTypes.AttemptDetails {
    switch (attempts.get(attemptId)) {
      case null null;
      case (?attempt) {
        let subjectQuestions = questions.values().filter(
          func(q : QuestionTypes.Question) : Bool { q.subjectId == attempt.subjectId },
        ).toArray();
        let correctAnswers = subjectQuestions.map(func(q : QuestionTypes.Question) : Nat { q.correctOptionIndex });
        ?{ attempt = toPublic(attempt); correctAnswers };
      };
    };
  };

  public func listByStudent(
    attempts : Map.Map<CommonTypes.AttemptId, QuizAttempt>,
    studentPrincipal : CommonTypes.UserId,
  ) : [QuizAttemptPublic] {
    attempts.values().filter<QuizAttempt>(
      func(a) { a.studentPrincipal == studentPrincipal },
    ).map<QuizAttempt, QuizAttemptPublic>(toPublic).toArray();
  };

  public func listBySubject(
    attempts : Map.Map<CommonTypes.AttemptId, QuizAttempt>,
    subjectId : CommonTypes.SubjectId,
  ) : [QuizAttemptPublic] {
    attempts.values().filter<QuizAttempt>(
      func(a) { a.subjectId == subjectId },
    ).map<QuizAttempt, QuizAttemptPublic>(toPublic).toArray();
  };

  public func listAll(
    attempts : Map.Map<CommonTypes.AttemptId, QuizAttempt>,
  ) : [QuizAttemptPublic] {
    attempts.values().map<QuizAttempt, QuizAttemptPublic>(toPublic).toArray();
  };
};
