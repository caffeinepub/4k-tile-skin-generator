import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Array "mo:core/Array";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";



actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can see profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public type CreationRecord = {
    title : Text;
    timestamp : Time.Time;
    creativeFreedom : Bool;
    settings : Text;
    thumbnailUrl : ?Text;
    usable : Bool;
  };

  let database = Map.empty<Principal, { records : List.List<CreationRecord> }>();

  func getOrCreateRecordData(user : Principal) : { records : List.List<CreationRecord> } {
    switch (database.get(user)) {
      case (?data) { data };
      case (null) {
        let newData = { records = List.empty<CreationRecord>() };
        database.add(user, newData);
        newData;
      };
    };
  };

  public shared ({ caller }) func saveCreationRecord(title : Text, creativeFreedom : Bool, settings : Text, thumbnailUrl : ?Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save creation records");
    };

    let newRecord : CreationRecord = {
      title;
      timestamp = Time.now();
      creativeFreedom;
      settings;
      thumbnailUrl;
      usable = true;
    };

    let recordData = getOrCreateRecordData(caller);
    recordData.records.add(newRecord);
  };

  public query ({ caller }) func getAllCreationRecords() : async [CreationRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view records");
    };

    if (AccessControl.isAdmin(accessControlState, caller)) {
      var allRecords = List.empty<CreationRecord>();
      for ((_, data) in database.entries()) {
        for (record in data.records.values()) {
          if (record.usable) {
            allRecords.add(record);
          };
        };
      };
      allRecords.toArray();
    } else {
      switch (database.get(caller)) {
        case (null) { [] };
        case (?data) {
          let usableRecords = data.records.filter(func(record) { record.usable });
          usableRecords.toArray();
        };
      };
    };
  };

  public query ({ caller }) func getUserCreationRecords(user : Principal) : async [CreationRecord] {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own records");
    };
    switch (database.get(user)) {
      case (null) { [] };
      case (?data) {
        let usableRecords = data.records.filter(func(record) { record.usable });
        usableRecords.toArray();
      };
    };
  };
};
