module {
  type OldState = {
    var nextSubjectId : Nat;
    var nextQuestionId : Nat;
    var nextAttemptId : Nat;
    var nextCertificateId : Nat;
  };

  type NewState = {
    var nextSubjectId : Nat;
    var nextQuestionId : Nat;
    var nextAttemptId : Nat;
    var nextCertificateId : Nat;
    var nextTokenCounter : Nat;
  };

  type OldActor = {
    state : OldState;
  };

  type NewActor = {
    state : NewState;
  };

  public func run(old : OldActor) : NewActor {
    {
      state = {
        var nextSubjectId = old.state.nextSubjectId;
        var nextQuestionId = old.state.nextQuestionId;
        var nextAttemptId = old.state.nextAttemptId;
        var nextCertificateId = old.state.nextCertificateId;
        var nextTokenCounter = 0;
      };
    };
  };
};
