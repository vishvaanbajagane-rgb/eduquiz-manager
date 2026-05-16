import Types "common";

module {
  public type Certificate = {
    id : Types.CertificateId;
    studentId : Types.UserId;
    subjectId : Types.SubjectId;
    studentName : Text;
    subjectName : Text;
    completedAt : Types.Timestamp;
    score : Nat;
    totalQuestions : Nat;
  };
};
