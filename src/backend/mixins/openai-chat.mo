import AccessControl "mo:caffeineai-authorization/access-control";
import Runtime "mo:core/Runtime";
import OpenAI "../lib/openai";
import Principal "mo:core/Principal";

/// Admin-key OpenAI doubt-assistant.
/// Admin sets the API key once; all logged-in students can then ask doubts.
mixin (
  accessControlState : AccessControl.AccessControlState,
  openAIApiKey : { var value : ?Text },
) {
  /// Returns true if the admin has configured the OpenAI API key.
  public query func isOpenAIConfigured() : async Bool {
    openAIApiKey.value != null;
  };

  /// Admin-only: set the OpenAI API key.
  public shared ({ caller }) func setOpenAIApiKey(key : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can set the OpenAI API key");
    };
    openAIApiKey.value := ?key;
  };

  /// Transform function required by IC HTTP outcalls for consensus.
  /// Strips non-deterministic headers so all replicas agree on the response body.
  public shared query func transformOpenAIResponse(args : { response : { status : Nat; headers : [{ name : Text; value : Text }]; body : Blob }; context : Blob }) : async { status : Nat; headers : [{ name : Text; value : Text }]; body : Blob } {
    {
      status = args.response.status;
      body = args.response.body;
      headers = [];
    };
  };

  /// Ask the AI assistant a doubt. Any logged-in user may call this.
  public shared ({ caller }) func askDoubt(question : Text) : async Text {
    if (caller.isAnonymous()) {
      Runtime.trap("Please log in to use the AI assistant");
    };
    let ?key = openAIApiKey.value else Runtime.trap("AI assistant is not configured");
    await* OpenAI.runChatCompletion(key, question, transformOpenAIResponse);
  };
};
