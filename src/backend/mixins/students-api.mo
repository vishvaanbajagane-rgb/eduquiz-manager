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

  public shared ({ caller }) func getMyProfile() : async StudentTypes.StudentProfilePublic {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: must be logged in");
    };
    StudentsLib.ensureRegistered(students, caller);
  };

  public shared ({ caller }) func updateMyDisplayName(name : Text) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: must be logged in");
    };
    StudentsLib.updateDisplayName(students, caller, name);
  };

  public shared ({ caller }) func updateMyAccentColor(color : Text) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: must be logged in");
    };
    StudentsLib.updateAccentColor(students, caller, color);
  };

  public shared ({ caller }) func updateMyDepartment(value : Text) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: must be logged in");
    };
    StudentsLib.updateDepartment(students, caller, value);
  };

  public shared ({ caller }) func updateMyRegisterNumber(value : Text) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: must be logged in");
    };
    StudentsLib.updateRegisterNumber(students, caller, value);
  };

  public shared ({ caller }) func updateMyEnrollNumber(value : Text) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: must be logged in");
    };
    StudentsLib.updateEnrollNumber(students, caller, value);
  };

  public shared ({ caller }) func updateMySection(value : Text) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: must be logged in");
    };
    StudentsLib.updateSection(students, caller, value);
  };

  public query ({ caller }) func getAllStudentNames() : async [StudentTypes.StudentNameEntry] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: only admins can view student names");
    };
    StudentsLib.getAllNames(students);
  };

  public query ({ caller }) func listAllStudents() : async [StudentTypes.StudentSummary] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: only admins can view all students");
    };
    StudentsLib.getSummaries(students, attempts);
  };
};
