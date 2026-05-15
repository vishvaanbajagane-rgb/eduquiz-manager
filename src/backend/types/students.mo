import Types "common";

module {
  public type StudentProfile = {
    principal : Types.UserId;
    var displayName : Text;
    registeredAt : Types.Timestamp;
  };

  public type StudentProfilePublic = {
    principal : Types.UserId;
    displayName : Text;
    registeredAt : Types.Timestamp;
  };

  public type StudentSummary = {
    principal : Types.UserId;
    displayName : Text;
    totalAttempts : Nat;
    averageScore : Nat;
  };
};
