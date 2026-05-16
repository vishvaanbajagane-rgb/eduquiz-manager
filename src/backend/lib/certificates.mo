import Map "mo:core/Map";
import CommonTypes "../types/common";
import CertTypes "../types/certificates";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Int "mo:core/Int";

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

  /// Generate a stable share token for a certificate.
  /// Returns the existing token if one already exists, otherwise creates a new one.
  public func getOrCreateShareToken(
    shareTokens : Map.Map<Text, CommonTypes.CertificateId>,
    certIdToToken : Map.Map<CommonTypes.CertificateId, Text>,
    cert : Certificate,
    state : { var nextTokenCounter : Nat },
  ) : Text {
    switch (certIdToToken.get(cert.id)) {
      case (?existing) { existing };
      case null {
        let token = cert.id.toText() # "-" # cert.completedAt.toText() # "-" # state.nextTokenCounter.toText();
        state.nextTokenCounter += 1;
        shareTokens.add(token, cert.id);
        certIdToToken.add(cert.id, token);
        token;
      };
    };
  };

  /// Look up a certificate by share token.
  public func getByToken(
    shareTokens : Map.Map<Text, CommonTypes.CertificateId>,
    certificates : Map.Map<CommonTypes.CertificateId, Certificate>,
    token : Text,
  ) : ?Certificate {
    switch (shareTokens.get(token)) {
      case (?certId) { certificates.get(certId) };
      case null { null };
    };
  };
};
