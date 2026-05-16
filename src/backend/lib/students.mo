import Map "mo:core/Map";
import Time "mo:core/Time";
import StudentTypes "../types/students";
import QuizTypes "../types/quiz";
import CommonTypes "../types/common";
import Principal "mo:core/Principal";

module {
  public type StudentProfile = StudentTypes.StudentProfile;
  public type StudentProfilePublic = StudentTypes.StudentProfilePublic;
  public type StudentSummary = StudentTypes.StudentSummary;

  public func toPublic(profile : StudentProfile) : StudentProfilePublic {
    {
      principal = profile.principal;
      displayName = profile.displayName;
      accentColor = profile.accentColor;
      department = profile.department;
      registerNumber = profile.registerNumber;
      enrollNumber = profile.enrollNumber;
      section = profile.section;
      registeredAt = profile.registeredAt;
    };
  };

  public func ensureRegistered(
    students : Map.Map<CommonTypes.UserId, StudentProfile>,
    principal : CommonTypes.UserId,
  ) : StudentProfilePublic {
    switch (students.get(principal)) {
      case (?existing) toPublic(existing);
      case null {
        let profile : StudentProfile = {
          principal;
          var displayName = principal.toText();
          var accentColor = "";
          var department = "";
          var registerNumber = "";
          var enrollNumber = "";
          var section = "";
          registeredAt = Time.now();
        };
        students.add(principal, profile);
        toPublic(profile);
      };
    };
  };

  public func getProfile(
    students : Map.Map<CommonTypes.UserId, StudentProfile>,
    principal : CommonTypes.UserId,
  ) : ?StudentProfilePublic {
    switch (students.get(principal)) {
      case null null;
      case (?p) ?toPublic(p);
    };
  };

  public func updateDisplayName(
    students : Map.Map<CommonTypes.UserId, StudentProfile>,
    principal : CommonTypes.UserId,
    name : Text,
  ) : Bool {
    switch (students.get(principal)) {
      case null false;
      case (?profile) {
        profile.displayName := name;
        true;
      };
    };
  };

  public func updateAccentColor(
    students : Map.Map<CommonTypes.UserId, StudentProfile>,
    principal : CommonTypes.UserId,
    color : Text,
  ) : Bool {
    switch (students.get(principal)) {
      case null false;
      case (?profile) {
        profile.accentColor := color;
        true;
      };
    };
  };

  public func updateDepartment(
    students : Map.Map<CommonTypes.UserId, StudentProfile>,
    principal : CommonTypes.UserId,
    value : Text,
  ) : Bool {
    switch (students.get(principal)) {
      case null false;
      case (?profile) {
        profile.department := value;
        true;
      };
    };
  };

  public func updateRegisterNumber(
    students : Map.Map<CommonTypes.UserId, StudentProfile>,
    principal : CommonTypes.UserId,
    value : Text,
  ) : Bool {
    switch (students.get(principal)) {
      case null false;
      case (?profile) {
        profile.registerNumber := value;
        true;
      };
    };
  };

  public func updateEnrollNumber(
    students : Map.Map<CommonTypes.UserId, StudentProfile>,
    principal : CommonTypes.UserId,
    value : Text,
  ) : Bool {
    switch (students.get(principal)) {
      case null false;
      case (?profile) {
        profile.enrollNumber := value;
        true;
      };
    };
  };

  public func updateSection(
    students : Map.Map<CommonTypes.UserId, StudentProfile>,
    principal : CommonTypes.UserId,
    value : Text,
  ) : Bool {
    switch (students.get(principal)) {
      case null false;
      case (?profile) {
        profile.section := value;
        true;
      };
    };
  };

  public func listAll(
    students : Map.Map<CommonTypes.UserId, StudentProfile>,
  ) : [StudentProfilePublic] {
    students.values().map<StudentProfile, StudentProfilePublic>(toPublic).toArray();
  };

  public func getSummaries(
    students : Map.Map<CommonTypes.UserId, StudentProfile>,
    attempts : Map.Map<CommonTypes.AttemptId, QuizTypes.QuizAttempt>,
  ) : [StudentSummary] {
    students.values().map<StudentProfile, StudentSummary>(
      func(student) {
        let studentAttempts = attempts.values().filter(
          func(a : QuizTypes.QuizAttempt) : Bool {
            a.studentPrincipal == student.principal and a.completed
          },
        ).toArray();
        let total = studentAttempts.size();
        let avgScore = if (total == 0) {
          0;
        } else {
          let sum = studentAttempts.foldLeft(0, func(acc, a) { acc + a.score });
          sum / total;
        };
        {
          principal = student.principal;
          displayName = student.displayName;
          totalAttempts = total;
          averageScore = avgScore;
        };
      },
    ).toArray();
  };
};
