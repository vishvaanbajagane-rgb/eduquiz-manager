import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import SubjectTypes "../types/subjects";
import CommonTypes "../types/common";

module {
  public type Subject = SubjectTypes.Subject;
  public type SubjectWithStats = SubjectTypes.SubjectWithStats;

  public func create(
    subjects : Map.Map<CommonTypes.SubjectId, Subject>,
    state : { var nextSubjectId : Nat },
    payload : SubjectTypes.CreateSubjectPayload,
  ) : Subject {
    let id = state.nextSubjectId;
    state.nextSubjectId += 1;
    let subject : Subject = {
      id;
      name = payload.name;
      description = payload.description;
      createdAt = Time.now();
    };
    subjects.add(id, subject);
    subject;
  };

  public func list(
    subjects : Map.Map<CommonTypes.SubjectId, Subject>,
  ) : [Subject] {
    subjects.values().toArray();
  };

  public func listWithStats(
    subjects : Map.Map<CommonTypes.SubjectId, Subject>,
    questionCountBySubject : Map.Map<CommonTypes.SubjectId, Nat>,
  ) : [SubjectWithStats] {
    subjects.values().map<Subject, SubjectWithStats>(
      func(s) {
        let count = switch (questionCountBySubject.get(s.id)) {
          case (?c) c;
          case null 0;
        };
        {
          id = s.id;
          name = s.name;
          description = s.description;
          createdAt = s.createdAt;
          questionCount = count;
        };
      },
    ).toArray();
  };

  public func update(
    subjects : Map.Map<CommonTypes.SubjectId, Subject>,
    payload : SubjectTypes.UpdateSubjectPayload,
  ) : Bool {
    switch (subjects.get(payload.id)) {
      case null false;
      case (?existing) {
        subjects.add(payload.id, { existing with name = payload.name; description = payload.description });
        true;
      };
    };
  };

  public func remove(
    subjects : Map.Map<CommonTypes.SubjectId, Subject>,
    id : CommonTypes.SubjectId,
  ) : Bool {
    switch (subjects.get(id)) {
      case null false;
      case (?_) {
        subjects.remove(id);
        true;
      };
    };
  };

  public func get(
    subjects : Map.Map<CommonTypes.SubjectId, Subject>,
    id : CommonTypes.SubjectId,
  ) : ?Subject {
    subjects.get(id);
  };
};
