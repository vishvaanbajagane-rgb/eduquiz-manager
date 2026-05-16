import Debug "mo:core/Debug";
import Map "mo:core/Map";
import AccessControl "mo:caffeineai-authorization/access-control";
import Runtime "mo:core/Runtime";
import CertTypes "../types/certificates";
import CommonTypes "../types/common";
import CertsLib "../lib/certificates";

mixin (
  accessControlState : AccessControl.AccessControlState,
  certificates : Map.Map<CommonTypes.CertificateId, CertsLib.Certificate>,
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
};
