import Types "common";

module {
  public type Subject = {
    id : Types.SubjectId;
    name : Text;
    description : Text;
    createdAt : Types.Timestamp;
  };

  public type SubjectWithStats = {
    id : Types.SubjectId;
    name : Text;
    description : Text;
    createdAt : Types.Timestamp;
    questionCount : Nat;
  };

  public type CreateSubjectPayload = {
    name : Text;
    description : Text;
  };

  public type UpdateSubjectPayload = {
    id : Types.SubjectId;
    name : Text;
    description : Text;
  };
};
