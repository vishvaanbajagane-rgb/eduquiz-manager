import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Nat64 "mo:core/Nat64";
import IC "ic:aaaaa-aa";
import Blob "mo:core/Blob";

module {
  public type HttpHeader = { name : Text; value : Text };
  public type HttpResponse = { status : Nat; headers : [HttpHeader]; body : Blob };
  public type TransformArgs = { response : HttpResponse; context : Blob };
  public type TransformFn = shared query (TransformArgs) -> async HttpResponse;

  // Remove characters that would break raw JSON string embedding
  private func sanitize(s : Text) : Text {
    s.replace(#text "\"", "'")
     .replace(#text "\\", "-")
     .replace(#text "\n", " ")
     .replace(#text "\r", " ")
  };

  public func runChatCompletion(apiKey : Text, question : Text, transform : TransformFn) : async* Text {
    let q = sanitize(question);
    let sys = "You are an educational AI assistant helping students with their studies. Answer clearly and helpfully.";

    let bodyText =
      "{\"model\":\"gemini-2.0-flash\",\"messages\":[" #
      "{\"role\":\"system\",\"content\":\"" # sys # "\"}," #
      "{\"role\":\"user\",\"content\":\"" # q # "\"}" #
      "],\"max_tokens\":1000}";

    let bodyBlob = bodyText.encodeUtf8();

    let request : IC.http_request_args = {
      url = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
      max_response_bytes = ?Nat64.fromNat(20_000);
      headers = [
        { name = "Content-Type"; value = "application/json" },
        { name = "Authorization"; value = "Bearer " # apiKey },
        { name = "idempotency-key"; value = "gemini-" # q.size().toText() },
      ];
      body = ?bodyBlob;
      method = #post;
      transform = ?{ function = transform; context = Blob.fromArray([]) };
      is_replicated = ?false;
    };

    let response = await (with cycles = 400_000_000) IC.http_request(request);

    if (response.status != 200) {
      return "Error: AI service returned HTTP " # response.status.toText() # ". Check API key or account credits.";
    };

    switch (response.body.decodeUtf8()) {
      case null { "Error: Could not decode AI response" };
      case (?text) { extractContent(text) };
    };
  };

  // Extract the content value from an OpenAI JSON response.
  // OpenAI response structure: {"choices":[{"message":{"content":"ANSWER","refusal":null}...}]}
  // Strategy: split on "content":" then split remainder on ","refusal" to get exact answer.
  private func extractContent(json : Text) : Text {
    // Try OpenAI-compatible format first: {"choices":[{"message":{"content":"ANSWER","refusal":null}}]}
    var iter = json.split(#text "\"content\":\"");
    ignore iter.next(); // skip everything before "content":"
    switch (iter.next()) {
      case (?afterContent) {
        var endIter = afterContent.split(#text "\",\"refusal\"");
        switch (endIter.next()) {
          case (?content) {
            if (content.size() > 0) return content;
          };
          case null {};
        };
      };
      case null {};
    };

    // Fallback: try Gemini native format: {"candidates":[{"content":{"parts":[{"text":"ANSWER"}]}}]}
    var iter2 = json.split(#text "\"text\":\"");
    ignore iter2.next(); // skip everything before "text":"
    switch (iter2.next()) {
      case null { "No response received from AI." };
      case (?afterText) {
        var endIter2 = afterText.split(#text "\"");
        switch (endIter2.next()) {
          case null { "No response received from AI." };
          case (?content) {
            if (content.size() == 0) "No response received from AI." else content
          };
        };
      };
    };
  };
}
