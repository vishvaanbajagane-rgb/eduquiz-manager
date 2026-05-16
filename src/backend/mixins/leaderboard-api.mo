import Map "mo:core/Map";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
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
  /// Returns the global top-10 leaderboard by average score.
  /// Visible to all logged-in users.
  public query ({ caller }) func getLeaderboard() : async [StudentTypes.LeaderboardEntry] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: must be logged in");
    };
    let summaries = StudentsLib.getSummaries(students, attempts);
    let sorted = summaries.sort(
      func(a, b) { Nat.compare(b.averageScore, a.averageScore) },
    );
    let top10 = if (sorted.size() > 10) { sorted.sliceToArray(0, 10) } else { sorted };
    top10.mapEntries<StudentTypes.StudentSummary, StudentTypes.LeaderboardEntry>(
      func(s, i) {
        {
          rank = i + 1;
          principal = s.principal;
          displayName = s.displayName;
          totalAttempts = s.totalAttempts;
          averageScore = s.averageScore;
        };
      }
    );
  };
};
