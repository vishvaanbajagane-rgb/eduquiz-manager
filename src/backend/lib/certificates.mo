import Map "mo:core/Map";
import CommonTypes "../types/common";
import CertTypes "../types/certificates";
import Nat "mo:core/Nat";

module {
  public type Certificate = CertTypes.Certificate;

  public func issue(
    certificates : Map.Map<CommonTypes.CertificateId, Certificate>,
    state : { var nextCertificateId : Nat },
    studentId : CommonTypes.UserId,
    subjectId : CommonTypes.SubjectId,
    studentName : Text,
    subjectName : Text,
    completedAt : CommonTypes.Timestamp,
    score : Nat,
    totalQuestions : Nat,
  ) : Certificate {
    let id = state.nextCertificateId;
    state.nextCertificateId += 1;
    let cert : Certificate = {
      id;
      studentId;
      subjectId;
      studentName;
      subjectName;
      completedAt;
      score;
      totalQuestions;
    };
    certificates.add(id, cert);
    cert;
  };

  public func listByStudent(
    certificates : Map.Map<CommonTypes.CertificateId, Certificate>,
    studentId : CommonTypes.UserId,
  ) : [Certificate] {
    certificates.values().filter(
      func(c : Certificate) : Bool { c.studentId == studentId }
    ).toArray();
  };

  public func getForStudentSubject(
    certificates : Map.Map<CommonTypes.CertificateId, Certificate>,
    studentId : CommonTypes.UserId,
    subjectId : CommonTypes.SubjectId,
  ) : ?Certificate {
    certificates.values().find(
      func(c : Certificate) : Bool {
        c.studentId == studentId and c.subjectId == subjectId
      }
    );
  };

  public func hasCompleted(
    certificates : Map.Map<CommonTypes.CertificateId, Certificate>,
    studentId : CommonTypes.UserId,
    subjectId : CommonTypes.SubjectId,
  ) : Bool {
    getForStudentSubject(certificates, studentId, subjectId) != null;
  };
};
