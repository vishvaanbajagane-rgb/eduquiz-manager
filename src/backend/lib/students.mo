import Map "mo:core/Map";
import Time "mo:core/Time";
import StudentTypes "../types/students";
import QuizTypes "../types/quiz";
import CommonTypes "../types/common";

module {
  public type StudentProfile = StudentTypes.StudentProfile;
  public type StudentProfilePublic = StudentTypes.StudentProfilePublic;
  public type StudentSummary = StudentTypes.StudentSummary;

  public func toPublic(profile : StudentProfile) : StudentProfilePublic {
    {
      principal = profile.principal;
      displayName = profile.displayName;
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
