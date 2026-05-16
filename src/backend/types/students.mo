import Types "common";

module {
  public type StudentProfile = {
    principal : Types.UserId;
    var displayName : Text;
    var accentColor : Text;
    var department : Text;
    var registerNumber : Text;
    var enrollNumber : Text;
    var section : Text;
    registeredAt : Types.Timestamp;
  };

  public type StudentProfilePublic = {
    principal : Types.UserId;
    displayName : Text;
    accentColor : Text;
    department : Text;
    registerNumber : Text;
    enrollNumber : Text;
    section : Text;
    registeredAt : Types.Timestamp;
  };

  public type StudentSummary = {
    principal : Types.UserId;
    displayName : Text;
    totalAttempts : Nat;
    averageScore : Nat;
  };

  public type LeaderboardEntry = {
    rank : Nat;
    principal : Types.UserId;
    displayName : Text;
    totalAttempts : Nat;
    averageScore : Nat;
  };
};
