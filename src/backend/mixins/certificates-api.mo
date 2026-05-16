import Map "mo:core/Map";
import Text "mo:core/Text";
import AccessControl "mo:caffeineai-authorization/access-control";
import Runtime "mo:core/Runtime";
import CertTypes "../types/certificates";
import CommonTypes "../types/common";
import CertsLib "../lib/certificates";

mixin (
  accessControlState : AccessControl.AccessControlState,
  certificates : Map.Map<CommonTypes.CertificateId, CertsLib.Certificate>,
  shareTokens : Map.Map<Text, CommonTypes.CertificateId>,
  certIdToToken : Map.Map<CommonTypes.CertificateId, Text>,
  shareState : { var nextTokenCounter : Nat },
) {
  /// Returns all certificates earned by the calling student.
  public query ({ caller }) func getCertificates() : async [CertTypes.Certificate] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: must be logged in");
    };
    CertsLib.listByStudent(certificates, caller);
  };

  /// Returns the certificate for the calling student for a specific subject, if any.
  public query ({ caller }) func getSubjectCertificate(subjectId : CommonTypes.SubjectId) : async ?CertTypes.Certificate {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: must be logged in");
    };
    CertsLib.getForStudentSubject(certificates, caller, subjectId);
  };

  /// Creates or retrieves a share token for the caller's certificate for a given subject.
  /// Caller must own the certificate.
  public shared ({ caller }) func generateCertificateShareToken(subjectId : CommonTypes.SubjectId) : async ?Text {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: must be logged in");
    };
    switch (CertsLib.getForStudentSubject(certificates, caller, subjectId)) {
      case null { null };
      case (?cert) {
        ?CertsLib.getOrCreateShareToken(shareTokens, certIdToToken, cert, shareState);
      };
    };
  };

  /// Public — no authentication required. Returns a certificate by its share token.
  public query func getCertificateByToken(token : Text) : async ?CertTypes.Certificate {
    CertsLib.getByToken(shareTokens, certificates, token);
  };
};
