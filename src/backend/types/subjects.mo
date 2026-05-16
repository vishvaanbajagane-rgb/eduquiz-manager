import Types "common";

module {
  public type Subject = {
    id : Types.SubjectId;
    name : Text;
    description : Text;
    createdAt : Types.Timestamp;
    timerMinutes : ?Nat;
  };

  public type SubjectWithStats = {
    id : Types.SubjectId;
    name : Text;
    description : Text;
    createdAt : Types.Timestamp;
    questionCount : Nat;
    timerMinutes : ?Nat;
  };

  public type CreateSubjectPayload = {
    name : Text;
    description : Text;
    timerMinutes : ?Nat;
  };

  public type UpdateSubjectPayload = {
    id : Types.SubjectId;
    name : Text;
    description : Text;
    timerMinutes : ?Nat;
  };
};
