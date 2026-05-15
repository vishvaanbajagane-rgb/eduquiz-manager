import Map "mo:core/Map";
import AccessControl "mo:caffeineai-authorization/access-control";
import Runtime "mo:core/Runtime";
import StudentTypes "../types/students";
import QuizTypes "../types/quiz";
import CommonTypes "../types/common";
import StudentsLib "../lib/students";

mixin (
  accessControlState : AccessControl.AccessControlState,
  students : Map.Map<CommonTypes.UserId, StudentsLib.StudentProfile>,
  attempts : Map.Map<CommonTypes.AttemptId, QuizTypes.QuizAttempt>,
) {
  // Auto-register or return existing profile for the caller
  public shared ({ caller }) func registerStudent() : async StudentTypes.StudentProfilePublic {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: must be logged in to register");
    };
    StudentsLib.ensureRegistered(students, caller);
  };

  public query ({ caller }) func getMyProfile() : async ?StudentTypes.StudentProfilePublic {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: must be logged in");
    };
    StudentsLib.getProfile(students, caller);
  };

  public shared ({ caller }) func updateMyDisplayName(name : Text) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: must be logged in");
    };
    StudentsLib.updateDisplayName(students, caller, name);
  };

  public query ({ caller }) func listAllStudents() : async [StudentTypes.StudentSummary] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: only admins can view all students");
    };
    StudentsLib.getSummaries(students, attempts);
  };
};
