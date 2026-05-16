var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _client, _currentQuery, _currentQueryInitialState, _currentResult, _currentResultState, _currentResultOptions, _currentThenable, _selectError, _selectFn, _selectResult, _lastQueryWithDefinedData, _staleTimeoutId, _refetchIntervalId, _currentRefetchInterval, _trackedProps, _QueryObserver_instances, executeFetch_fn, updateStaleTimeout_fn, computeRefetchInterval_fn, updateRefetchInterval_fn, updateTimers_fn, clearStaleTimeout_fn, clearRefetchInterval_fn, updateQuery_fn, notify_fn, _a;
import { P as ProtocolError, T as TimeoutWaitingForResponseErrorCode, y as utf8ToBytes, E as ExternalError, M as MissingRootKeyErrorCode, C as Certificate$1, A as lookupResultToBuffer, D as RequestStatusResponseStatus, U as UnknownError, F as RequestStatusDoneNoReplyErrorCode, G as RejectError, H as CertifiedRejectErrorCode, I as UNREACHABLE_ERROR, J as InputError, K as InvalidReadStateRequestErrorCode, N as ReadRequestType, O as Principal, Q as IDL, V as MissingCanisterIdErrorCode, W as HttpAgent, X as encode, Y as QueryResponseStatus, Z as UncertifiedRejectErrorCode, _ as isV3ResponseBody, $ as isV2ResponseBody, a0 as UncertifiedRejectUpdateErrorCode, a1 as UnexpectedErrorCode, a2 as decode, S as Subscribable, a3 as pendingThenable, a4 as resolveEnabled, s as shallowEqualObjects, a5 as resolveStaleTime, p as noop, a6 as environmentManager, a7 as isValidTimeout, a8 as timeUntilStale, a9 as timeoutManager, aa as focusManager, ab as fetchState, ac as replaceData, n as notifyManager, r as reactExports, q as shouldThrowError, b as useQueryClient, x as useInternetIdentity, ad as createActorWithConfig, ae as Variant, af as Record, ag as Vec, ah as Opt, ai as Service, aj as Func, ak as Nat, al as Text, am as Principal$1, an as Null, ao as Int, ap as Bool } from "./index-DcBYUGDn.js";
const FIVE_MINUTES_IN_MSEC = 5 * 60 * 1e3;
function defaultStrategy() {
  return chain(conditionalDelay(once(), 1e3), backoff(1e3, 1.2), timeout(FIVE_MINUTES_IN_MSEC));
}
function once() {
  let first = true;
  return async () => {
    if (first) {
      first = false;
      return true;
    }
    return false;
  };
}
function conditionalDelay(condition, timeInMsec) {
  return async (canisterId, requestId, status) => {
    if (await condition(canisterId, requestId, status)) {
      return new Promise((resolve) => setTimeout(resolve, timeInMsec));
    }
  };
}
function timeout(timeInMsec) {
  const end = Date.now() + timeInMsec;
  return async (_canisterId, requestId, status) => {
    if (Date.now() > end) {
      throw ProtocolError.fromCode(new TimeoutWaitingForResponseErrorCode(`Request timed out after ${timeInMsec} msec`, requestId, status));
    }
  };
}
function backoff(startingThrottleInMsec, backoffFactor) {
  let currentThrottling = startingThrottleInMsec;
  return () => new Promise((resolve) => setTimeout(() => {
    currentThrottling *= backoffFactor;
    resolve();
  }, currentThrottling));
}
function chain(...strategies) {
  return async (canisterId, requestId, status) => {
    for (const a of strategies) {
      await a(canisterId, requestId, status);
    }
  };
}
const DEFAULT_POLLING_OPTIONS = {
  preSignReadStateRequest: false
};
function hasProperty(value, property) {
  return Object.prototype.hasOwnProperty.call(value, property);
}
function isObjectWithProperty(value, property) {
  return value !== null && typeof value === "object" && hasProperty(value, property);
}
function hasFunction(value, property) {
  return hasProperty(value, property) && typeof value[property] === "function";
}
function isSignedReadStateRequestWithExpiry(value) {
  return isObjectWithProperty(value, "body") && isObjectWithProperty(value.body, "content") && value.body.content.request_type === ReadRequestType.ReadState && isObjectWithProperty(value.body.content, "ingress_expiry") && typeof value.body.content.ingress_expiry === "object" && value.body.content.ingress_expiry !== null && hasFunction(value.body.content.ingress_expiry, "toHash");
}
async function pollForResponse(agent, canisterId, requestId, options = {}) {
  const path = [utf8ToBytes("request_status"), requestId];
  let state;
  let currentRequest;
  const preSignReadStateRequest = options.preSignReadStateRequest ?? false;
  if (preSignReadStateRequest) {
    currentRequest = await constructRequest({
      paths: [path],
      agent,
      pollingOptions: options
    });
    state = await agent.readState(canisterId, { paths: [path] }, void 0, currentRequest);
  } else {
    state = await agent.readState(canisterId, { paths: [path] });
  }
  if (agent.rootKey == null) {
    throw ExternalError.fromCode(new MissingRootKeyErrorCode());
  }
  const cert = await Certificate$1.create({
    certificate: state.certificate,
    rootKey: agent.rootKey,
    canisterId,
    blsVerify: options.blsVerify,
    agent
  });
  const maybeBuf = lookupResultToBuffer(cert.lookup_path([...path, utf8ToBytes("status")]));
  let status;
  if (typeof maybeBuf === "undefined") {
    status = RequestStatusResponseStatus.Unknown;
  } else {
    status = new TextDecoder().decode(maybeBuf);
  }
  switch (status) {
    case RequestStatusResponseStatus.Replied: {
      return {
        reply: lookupResultToBuffer(cert.lookup_path([...path, "reply"])),
        certificate: cert
      };
    }
    case RequestStatusResponseStatus.Received:
    case RequestStatusResponseStatus.Unknown:
    case RequestStatusResponseStatus.Processing: {
      const strategy = options.strategy ?? defaultStrategy();
      await strategy(canisterId, requestId, status);
      return pollForResponse(agent, canisterId, requestId, {
        ...options,
        // Pass over either the strategy already provided or the new one created above
        strategy,
        request: currentRequest
      });
    }
    case RequestStatusResponseStatus.Rejected: {
      const rejectCode = new Uint8Array(lookupResultToBuffer(cert.lookup_path([...path, "reject_code"])))[0];
      const rejectMessage = new TextDecoder().decode(lookupResultToBuffer(cert.lookup_path([...path, "reject_message"])));
      const errorCodeBuf = lookupResultToBuffer(cert.lookup_path([...path, "error_code"]));
      const errorCode = errorCodeBuf ? new TextDecoder().decode(errorCodeBuf) : void 0;
      throw RejectError.fromCode(new CertifiedRejectErrorCode(requestId, rejectCode, rejectMessage, errorCode));
    }
    case RequestStatusResponseStatus.Done:
      throw UnknownError.fromCode(new RequestStatusDoneNoReplyErrorCode(requestId));
  }
  throw UNREACHABLE_ERROR;
}
async function constructRequest(options) {
  var _a2;
  const { paths, agent, pollingOptions } = options;
  if (pollingOptions.request && isSignedReadStateRequestWithExpiry(pollingOptions.request)) {
    return pollingOptions.request;
  }
  const request = await ((_a2 = agent.createReadStateRequest) == null ? void 0 : _a2.call(agent, {
    paths
  }, void 0));
  if (!isSignedReadStateRequestWithExpiry(request)) {
    throw InputError.fromCode(new InvalidReadStateRequestErrorCode(request));
  }
  return request;
}
const metadataSymbol = Symbol.for("ic-agent-metadata");
class Actor {
  /**
   * Get the Agent class this Actor would call, or undefined if the Actor would use
   * the default agent (global.ic.agent).
   * @param actor The actor to get the agent of.
   */
  static agentOf(actor) {
    return actor[metadataSymbol].config.agent;
  }
  /**
   * Get the interface of an actor, in the form of an instance of a Service.
   * @param actor The actor to get the interface of.
   */
  static interfaceOf(actor) {
    return actor[metadataSymbol].service;
  }
  static canisterIdOf(actor) {
    return Principal.from(actor[metadataSymbol].config.canisterId);
  }
  static createActorClass(interfaceFactory, options) {
    const service = interfaceFactory({ IDL });
    class CanisterActor extends Actor {
      constructor(config) {
        if (!config.canisterId) {
          throw InputError.fromCode(new MissingCanisterIdErrorCode(config.canisterId));
        }
        const canisterId = typeof config.canisterId === "string" ? Principal.fromText(config.canisterId) : config.canisterId;
        super({
          config: {
            ...DEFAULT_ACTOR_CONFIG,
            ...config,
            canisterId
          },
          service
        });
        for (const [methodName, func] of service._fields) {
          if (options == null ? void 0 : options.httpDetails) {
            func.annotations.push(ACTOR_METHOD_WITH_HTTP_DETAILS);
          }
          if (options == null ? void 0 : options.certificate) {
            func.annotations.push(ACTOR_METHOD_WITH_CERTIFICATE);
          }
          this[methodName] = _createActorMethod(this, methodName, func, config.blsVerify);
        }
      }
    }
    return CanisterActor;
  }
  /**
   * Creates an actor with the given interface factory and configuration.
   *
   * The [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package can be used to generate the interface factory for your canister.
   * @param interfaceFactory - the interface factory for the actor, typically generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package
   * @param configuration - the configuration for the actor
   * @returns an actor with the given interface factory and configuration
   * @example
   * Using the interface factory generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package:
   * ```ts
   * import { Actor, HttpAgent } from '@icp-sdk/core/agent';
   * import { Principal } from '@icp-sdk/core/principal';
   * import { idlFactory } from './api/declarations/hello-world.did';
   *
   * const canisterId = Principal.fromText('rrkah-fqaaa-aaaaa-aaaaq-cai');
   *
   * const agent = await HttpAgent.create({
   *   host: 'https://icp-api.io',
   * });
   *
   * const actor = Actor.createActor(idlFactory, {
   *   agent,
   *   canisterId,
   * });
   *
   * const response = await actor.greet('world');
   * console.log(response);
   * ```
   * @example
   * Using the `createActor` wrapper function generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package:
   * ```ts
   * import { HttpAgent } from '@icp-sdk/core/agent';
   * import { Principal } from '@icp-sdk/core/principal';
   * import { createActor } from './api/hello-world';
   *
   * const canisterId = Principal.fromText('rrkah-fqaaa-aaaaa-aaaaq-cai');
   *
   * const agent = await HttpAgent.create({
   *   host: 'https://icp-api.io',
   * });
   *
   * const actor = createActor(canisterId, {
   *   agent,
   * });
   *
   * const response = await actor.greet('world');
   * console.log(response);
   * ```
   */
  static createActor(interfaceFactory, configuration) {
    if (!configuration.canisterId) {
      throw InputError.fromCode(new MissingCanisterIdErrorCode(configuration.canisterId));
    }
    return new (this.createActorClass(interfaceFactory))(configuration);
  }
  /**
   * Returns an actor with methods that return the http response details along with the result
   * @param interfaceFactory - the interface factory for the actor
   * @param configuration - the configuration for the actor
   * @deprecated - use createActor with actorClassOptions instead
   */
  static createActorWithHttpDetails(interfaceFactory, configuration) {
    return new (this.createActorClass(interfaceFactory, { httpDetails: true }))(configuration);
  }
  /**
   * Returns an actor with methods that return the http response details along with the result
   * @param interfaceFactory - the interface factory for the actor
   * @param configuration - the configuration for the actor
   * @param actorClassOptions - options for the actor class extended details to return with the result
   */
  static createActorWithExtendedDetails(interfaceFactory, configuration, actorClassOptions = {
    httpDetails: true,
    certificate: true
  }) {
    return new (this.createActorClass(interfaceFactory, actorClassOptions))(configuration);
  }
  constructor(metadata) {
    this[metadataSymbol] = Object.freeze(metadata);
  }
}
function decodeReturnValue(types, msg) {
  const returnValues = decode(types, msg);
  switch (returnValues.length) {
    case 0:
      return void 0;
    case 1:
      return returnValues[0];
    default:
      return returnValues;
  }
}
const DEFAULT_ACTOR_CONFIG = {
  pollingOptions: DEFAULT_POLLING_OPTIONS
};
const ACTOR_METHOD_WITH_HTTP_DETAILS = "http-details";
const ACTOR_METHOD_WITH_CERTIFICATE = "certificate";
function _createActorMethod(actor, methodName, func, blsVerify) {
  let caller;
  if (func.annotations.includes("query") || func.annotations.includes("composite_query")) {
    caller = async (options, ...args) => {
      var _a2, _b;
      options = {
        ...options,
        ...(_b = (_a2 = actor[metadataSymbol].config).queryTransform) == null ? void 0 : _b.call(_a2, methodName, args, {
          ...actor[metadataSymbol].config,
          ...options
        })
      };
      const agent = options.agent || actor[metadataSymbol].config.agent || new HttpAgent();
      const cid = Principal.from(options.canisterId || actor[metadataSymbol].config.canisterId);
      const arg = encode(func.argTypes, args);
      const result = await agent.query(cid, {
        methodName,
        arg,
        effectiveCanisterId: options.effectiveCanisterId
      });
      const httpDetails = {
        ...result.httpDetails,
        requestDetails: result.requestDetails
      };
      switch (result.status) {
        case QueryResponseStatus.Rejected: {
          const uncertifiedRejectErrorCode = new UncertifiedRejectErrorCode(result.requestId, result.reject_code, result.reject_message, result.error_code, result.signatures);
          uncertifiedRejectErrorCode.callContext = {
            canisterId: cid,
            methodName,
            httpDetails
          };
          throw RejectError.fromCode(uncertifiedRejectErrorCode);
        }
        case QueryResponseStatus.Replied:
          return func.annotations.includes(ACTOR_METHOD_WITH_HTTP_DETAILS) ? {
            httpDetails,
            result: decodeReturnValue(func.retTypes, result.reply.arg)
          } : decodeReturnValue(func.retTypes, result.reply.arg);
      }
    };
  } else {
    caller = async (options, ...args) => {
      var _a2, _b;
      options = {
        ...options,
        ...(_b = (_a2 = actor[metadataSymbol].config).callTransform) == null ? void 0 : _b.call(_a2, methodName, args, {
          ...actor[metadataSymbol].config,
          ...options
        })
      };
      const agent = options.agent || actor[metadataSymbol].config.agent || HttpAgent.createSync();
      const { canisterId, effectiveCanisterId, pollingOptions } = {
        ...DEFAULT_ACTOR_CONFIG,
        ...actor[metadataSymbol].config,
        ...options
      };
      const cid = Principal.from(canisterId);
      const ecid = effectiveCanisterId !== void 0 ? Principal.from(effectiveCanisterId) : cid;
      const arg = encode(func.argTypes, args);
      const { requestId, response, requestDetails } = await agent.call(cid, {
        methodName,
        arg,
        effectiveCanisterId: ecid,
        nonce: options.nonce
      });
      let reply;
      let certificate;
      if (isV3ResponseBody(response.body)) {
        if (agent.rootKey == null) {
          throw ExternalError.fromCode(new MissingRootKeyErrorCode());
        }
        const cert = response.body.certificate;
        certificate = await Certificate$1.create({
          certificate: cert,
          rootKey: agent.rootKey,
          canisterId: ecid,
          blsVerify,
          agent
        });
        const path = [utf8ToBytes("request_status"), requestId];
        const status = new TextDecoder().decode(lookupResultToBuffer(certificate.lookup_path([...path, "status"])));
        switch (status) {
          case "replied":
            reply = lookupResultToBuffer(certificate.lookup_path([...path, "reply"]));
            break;
          case "rejected": {
            const rejectCode = new Uint8Array(lookupResultToBuffer(certificate.lookup_path([...path, "reject_code"])))[0];
            const rejectMessage = new TextDecoder().decode(lookupResultToBuffer(certificate.lookup_path([...path, "reject_message"])));
            const error_code_buf = lookupResultToBuffer(certificate.lookup_path([...path, "error_code"]));
            const error_code = error_code_buf ? new TextDecoder().decode(error_code_buf) : void 0;
            const certifiedRejectErrorCode = new CertifiedRejectErrorCode(requestId, rejectCode, rejectMessage, error_code);
            certifiedRejectErrorCode.callContext = {
              canisterId: cid,
              methodName,
              httpDetails: response
            };
            throw RejectError.fromCode(certifiedRejectErrorCode);
          }
        }
      } else if (isV2ResponseBody(response.body)) {
        const { reject_code, reject_message, error_code } = response.body;
        const errorCode = new UncertifiedRejectUpdateErrorCode(requestId, reject_code, reject_message, error_code);
        errorCode.callContext = {
          canisterId: cid,
          methodName,
          httpDetails: response
        };
        throw RejectError.fromCode(errorCode);
      }
      if (response.status === 202) {
        const pollOptions = {
          ...pollingOptions,
          blsVerify
        };
        const response2 = await pollForResponse(agent, ecid, requestId, pollOptions);
        certificate = response2.certificate;
        reply = response2.reply;
      }
      const shouldIncludeHttpDetails = func.annotations.includes(ACTOR_METHOD_WITH_HTTP_DETAILS);
      const shouldIncludeCertificate = func.annotations.includes(ACTOR_METHOD_WITH_CERTIFICATE);
      const httpDetails = { ...response, requestDetails };
      if (reply !== void 0) {
        if (shouldIncludeHttpDetails && shouldIncludeCertificate) {
          return {
            httpDetails,
            certificate,
            result: decodeReturnValue(func.retTypes, reply)
          };
        } else if (shouldIncludeCertificate) {
          return {
            certificate,
            result: decodeReturnValue(func.retTypes, reply)
          };
        } else if (shouldIncludeHttpDetails) {
          return {
            httpDetails,
            result: decodeReturnValue(func.retTypes, reply)
          };
        }
        return decodeReturnValue(func.retTypes, reply);
      } else {
        const errorCode = new UnexpectedErrorCode(`Call was returned undefined. We cannot determine if the call was successful or not. Return types: [${func.retTypes.map((t) => t.display()).join(",")}].`);
        errorCode.callContext = {
          canisterId: cid,
          methodName,
          httpDetails
        };
        throw UnknownError.fromCode(errorCode);
      }
    };
  }
  const handler = (...args) => caller({}, ...args);
  handler.withOptions = (options) => (...args) => caller(options, ...args);
  return handler;
}
var QueryObserver = (_a = class extends Subscribable {
  constructor(client, options) {
    super();
    __privateAdd(this, _QueryObserver_instances);
    __privateAdd(this, _client);
    __privateAdd(this, _currentQuery);
    __privateAdd(this, _currentQueryInitialState);
    __privateAdd(this, _currentResult);
    __privateAdd(this, _currentResultState);
    __privateAdd(this, _currentResultOptions);
    __privateAdd(this, _currentThenable);
    __privateAdd(this, _selectError);
    __privateAdd(this, _selectFn);
    __privateAdd(this, _selectResult);
    // This property keeps track of the last query with defined data.
    // It will be used to pass the previous data and query to the placeholder function between renders.
    __privateAdd(this, _lastQueryWithDefinedData);
    __privateAdd(this, _staleTimeoutId);
    __privateAdd(this, _refetchIntervalId);
    __privateAdd(this, _currentRefetchInterval);
    __privateAdd(this, _trackedProps, /* @__PURE__ */ new Set());
    this.options = options;
    __privateSet(this, _client, client);
    __privateSet(this, _selectError, null);
    __privateSet(this, _currentThenable, pendingThenable());
    this.bindMethods();
    this.setOptions(options);
  }
  bindMethods() {
    this.refetch = this.refetch.bind(this);
  }
  onSubscribe() {
    if (this.listeners.size === 1) {
      __privateGet(this, _currentQuery).addObserver(this);
      if (shouldFetchOnMount(__privateGet(this, _currentQuery), this.options)) {
        __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this);
      } else {
        this.updateResult();
      }
      __privateMethod(this, _QueryObserver_instances, updateTimers_fn).call(this);
    }
  }
  onUnsubscribe() {
    if (!this.hasListeners()) {
      this.destroy();
    }
  }
  shouldFetchOnReconnect() {
    return shouldFetchOn(
      __privateGet(this, _currentQuery),
      this.options,
      this.options.refetchOnReconnect
    );
  }
  shouldFetchOnWindowFocus() {
    return shouldFetchOn(
      __privateGet(this, _currentQuery),
      this.options,
      this.options.refetchOnWindowFocus
    );
  }
  destroy() {
    this.listeners = /* @__PURE__ */ new Set();
    __privateMethod(this, _QueryObserver_instances, clearStaleTimeout_fn).call(this);
    __privateMethod(this, _QueryObserver_instances, clearRefetchInterval_fn).call(this);
    __privateGet(this, _currentQuery).removeObserver(this);
  }
  setOptions(options) {
    const prevOptions = this.options;
    const prevQuery = __privateGet(this, _currentQuery);
    this.options = __privateGet(this, _client).defaultQueryOptions(options);
    if (this.options.enabled !== void 0 && typeof this.options.enabled !== "boolean" && typeof this.options.enabled !== "function" && typeof resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) !== "boolean") {
      throw new Error(
        "Expected enabled to be a boolean or a callback that returns a boolean"
      );
    }
    __privateMethod(this, _QueryObserver_instances, updateQuery_fn).call(this);
    __privateGet(this, _currentQuery).setOptions(this.options);
    if (prevOptions._defaulted && !shallowEqualObjects(this.options, prevOptions)) {
      __privateGet(this, _client).getQueryCache().notify({
        type: "observerOptionsUpdated",
        query: __privateGet(this, _currentQuery),
        observer: this
      });
    }
    const mounted = this.hasListeners();
    if (mounted && shouldFetchOptionally(
      __privateGet(this, _currentQuery),
      prevQuery,
      this.options,
      prevOptions
    )) {
      __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this);
    }
    this.updateResult();
    if (mounted && (__privateGet(this, _currentQuery) !== prevQuery || resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) !== resolveEnabled(prevOptions.enabled, __privateGet(this, _currentQuery)) || resolveStaleTime(this.options.staleTime, __privateGet(this, _currentQuery)) !== resolveStaleTime(prevOptions.staleTime, __privateGet(this, _currentQuery)))) {
      __privateMethod(this, _QueryObserver_instances, updateStaleTimeout_fn).call(this);
    }
    const nextRefetchInterval = __privateMethod(this, _QueryObserver_instances, computeRefetchInterval_fn).call(this);
    if (mounted && (__privateGet(this, _currentQuery) !== prevQuery || resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) !== resolveEnabled(prevOptions.enabled, __privateGet(this, _currentQuery)) || nextRefetchInterval !== __privateGet(this, _currentRefetchInterval))) {
      __privateMethod(this, _QueryObserver_instances, updateRefetchInterval_fn).call(this, nextRefetchInterval);
    }
  }
  getOptimisticResult(options) {
    const query = __privateGet(this, _client).getQueryCache().build(__privateGet(this, _client), options);
    const result = this.createResult(query, options);
    if (shouldAssignObserverCurrentProperties(this, result)) {
      __privateSet(this, _currentResult, result);
      __privateSet(this, _currentResultOptions, this.options);
      __privateSet(this, _currentResultState, __privateGet(this, _currentQuery).state);
    }
    return result;
  }
  getCurrentResult() {
    return __privateGet(this, _currentResult);
  }
  trackResult(result, onPropTracked) {
    return new Proxy(result, {
      get: (target, key) => {
        this.trackProp(key);
        onPropTracked == null ? void 0 : onPropTracked(key);
        if (key === "promise") {
          this.trackProp("data");
          if (!this.options.experimental_prefetchInRender && __privateGet(this, _currentThenable).status === "pending") {
            __privateGet(this, _currentThenable).reject(
              new Error(
                "experimental_prefetchInRender feature flag is not enabled"
              )
            );
          }
        }
        return Reflect.get(target, key);
      }
    });
  }
  trackProp(key) {
    __privateGet(this, _trackedProps).add(key);
  }
  getCurrentQuery() {
    return __privateGet(this, _currentQuery);
  }
  refetch({ ...options } = {}) {
    return this.fetch({
      ...options
    });
  }
  fetchOptimistic(options) {
    const defaultedOptions = __privateGet(this, _client).defaultQueryOptions(options);
    const query = __privateGet(this, _client).getQueryCache().build(__privateGet(this, _client), defaultedOptions);
    return query.fetch().then(() => this.createResult(query, defaultedOptions));
  }
  fetch(fetchOptions) {
    return __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this, {
      ...fetchOptions,
      cancelRefetch: fetchOptions.cancelRefetch ?? true
    }).then(() => {
      this.updateResult();
      return __privateGet(this, _currentResult);
    });
  }
  createResult(query, options) {
    var _a2;
    const prevQuery = __privateGet(this, _currentQuery);
    const prevOptions = this.options;
    const prevResult = __privateGet(this, _currentResult);
    const prevResultState = __privateGet(this, _currentResultState);
    const prevResultOptions = __privateGet(this, _currentResultOptions);
    const queryChange = query !== prevQuery;
    const queryInitialState = queryChange ? query.state : __privateGet(this, _currentQueryInitialState);
    const { state } = query;
    let newState = { ...state };
    let isPlaceholderData = false;
    let data;
    if (options._optimisticResults) {
      const mounted = this.hasListeners();
      const fetchOnMount = !mounted && shouldFetchOnMount(query, options);
      const fetchOptionally = mounted && shouldFetchOptionally(query, prevQuery, options, prevOptions);
      if (fetchOnMount || fetchOptionally) {
        newState = {
          ...newState,
          ...fetchState(state.data, query.options)
        };
      }
      if (options._optimisticResults === "isRestoring") {
        newState.fetchStatus = "idle";
      }
    }
    let { error, errorUpdatedAt, status } = newState;
    data = newState.data;
    let skipSelect = false;
    if (options.placeholderData !== void 0 && data === void 0 && status === "pending") {
      let placeholderData;
      if ((prevResult == null ? void 0 : prevResult.isPlaceholderData) && options.placeholderData === (prevResultOptions == null ? void 0 : prevResultOptions.placeholderData)) {
        placeholderData = prevResult.data;
        skipSelect = true;
      } else {
        placeholderData = typeof options.placeholderData === "function" ? options.placeholderData(
          (_a2 = __privateGet(this, _lastQueryWithDefinedData)) == null ? void 0 : _a2.state.data,
          __privateGet(this, _lastQueryWithDefinedData)
        ) : options.placeholderData;
      }
      if (placeholderData !== void 0) {
        status = "success";
        data = replaceData(
          prevResult == null ? void 0 : prevResult.data,
          placeholderData,
          options
        );
        isPlaceholderData = true;
      }
    }
    if (options.select && data !== void 0 && !skipSelect) {
      if (prevResult && data === (prevResultState == null ? void 0 : prevResultState.data) && options.select === __privateGet(this, _selectFn)) {
        data = __privateGet(this, _selectResult);
      } else {
        try {
          __privateSet(this, _selectFn, options.select);
          data = options.select(data);
          data = replaceData(prevResult == null ? void 0 : prevResult.data, data, options);
          __privateSet(this, _selectResult, data);
          __privateSet(this, _selectError, null);
        } catch (selectError) {
          __privateSet(this, _selectError, selectError);
        }
      }
    }
    if (__privateGet(this, _selectError)) {
      error = __privateGet(this, _selectError);
      data = __privateGet(this, _selectResult);
      errorUpdatedAt = Date.now();
      status = "error";
    }
    const isFetching = newState.fetchStatus === "fetching";
    const isPending = status === "pending";
    const isError = status === "error";
    const isLoading = isPending && isFetching;
    const hasData = data !== void 0;
    const result = {
      status,
      fetchStatus: newState.fetchStatus,
      isPending,
      isSuccess: status === "success",
      isError,
      isInitialLoading: isLoading,
      isLoading,
      data,
      dataUpdatedAt: newState.dataUpdatedAt,
      error,
      errorUpdatedAt,
      failureCount: newState.fetchFailureCount,
      failureReason: newState.fetchFailureReason,
      errorUpdateCount: newState.errorUpdateCount,
      isFetched: query.isFetched(),
      isFetchedAfterMount: newState.dataUpdateCount > queryInitialState.dataUpdateCount || newState.errorUpdateCount > queryInitialState.errorUpdateCount,
      isFetching,
      isRefetching: isFetching && !isPending,
      isLoadingError: isError && !hasData,
      isPaused: newState.fetchStatus === "paused",
      isPlaceholderData,
      isRefetchError: isError && hasData,
      isStale: isStale(query, options),
      refetch: this.refetch,
      promise: __privateGet(this, _currentThenable),
      isEnabled: resolveEnabled(options.enabled, query) !== false
    };
    const nextResult = result;
    if (this.options.experimental_prefetchInRender) {
      const hasResultData = nextResult.data !== void 0;
      const isErrorWithoutData = nextResult.status === "error" && !hasResultData;
      const finalizeThenableIfPossible = (thenable) => {
        if (isErrorWithoutData) {
          thenable.reject(nextResult.error);
        } else if (hasResultData) {
          thenable.resolve(nextResult.data);
        }
      };
      const recreateThenable = () => {
        const pending = __privateSet(this, _currentThenable, nextResult.promise = pendingThenable());
        finalizeThenableIfPossible(pending);
      };
      const prevThenable = __privateGet(this, _currentThenable);
      switch (prevThenable.status) {
        case "pending":
          if (query.queryHash === prevQuery.queryHash) {
            finalizeThenableIfPossible(prevThenable);
          }
          break;
        case "fulfilled":
          if (isErrorWithoutData || nextResult.data !== prevThenable.value) {
            recreateThenable();
          }
          break;
        case "rejected":
          if (!isErrorWithoutData || nextResult.error !== prevThenable.reason) {
            recreateThenable();
          }
          break;
      }
    }
    return nextResult;
  }
  updateResult() {
    const prevResult = __privateGet(this, _currentResult);
    const nextResult = this.createResult(__privateGet(this, _currentQuery), this.options);
    __privateSet(this, _currentResultState, __privateGet(this, _currentQuery).state);
    __privateSet(this, _currentResultOptions, this.options);
    if (__privateGet(this, _currentResultState).data !== void 0) {
      __privateSet(this, _lastQueryWithDefinedData, __privateGet(this, _currentQuery));
    }
    if (shallowEqualObjects(nextResult, prevResult)) {
      return;
    }
    __privateSet(this, _currentResult, nextResult);
    const shouldNotifyListeners = () => {
      if (!prevResult) {
        return true;
      }
      const { notifyOnChangeProps } = this.options;
      const notifyOnChangePropsValue = typeof notifyOnChangeProps === "function" ? notifyOnChangeProps() : notifyOnChangeProps;
      if (notifyOnChangePropsValue === "all" || !notifyOnChangePropsValue && !__privateGet(this, _trackedProps).size) {
        return true;
      }
      const includedProps = new Set(
        notifyOnChangePropsValue ?? __privateGet(this, _trackedProps)
      );
      if (this.options.throwOnError) {
        includedProps.add("error");
      }
      return Object.keys(__privateGet(this, _currentResult)).some((key) => {
        const typedKey = key;
        const changed = __privateGet(this, _currentResult)[typedKey] !== prevResult[typedKey];
        return changed && includedProps.has(typedKey);
      });
    };
    __privateMethod(this, _QueryObserver_instances, notify_fn).call(this, { listeners: shouldNotifyListeners() });
  }
  onQueryUpdate() {
    this.updateResult();
    if (this.hasListeners()) {
      __privateMethod(this, _QueryObserver_instances, updateTimers_fn).call(this);
    }
  }
}, _client = new WeakMap(), _currentQuery = new WeakMap(), _currentQueryInitialState = new WeakMap(), _currentResult = new WeakMap(), _currentResultState = new WeakMap(), _currentResultOptions = new WeakMap(), _currentThenable = new WeakMap(), _selectError = new WeakMap(), _selectFn = new WeakMap(), _selectResult = new WeakMap(), _lastQueryWithDefinedData = new WeakMap(), _staleTimeoutId = new WeakMap(), _refetchIntervalId = new WeakMap(), _currentRefetchInterval = new WeakMap(), _trackedProps = new WeakMap(), _QueryObserver_instances = new WeakSet(), executeFetch_fn = function(fetchOptions) {
  __privateMethod(this, _QueryObserver_instances, updateQuery_fn).call(this);
  let promise = __privateGet(this, _currentQuery).fetch(
    this.options,
    fetchOptions
  );
  if (!(fetchOptions == null ? void 0 : fetchOptions.throwOnError)) {
    promise = promise.catch(noop);
  }
  return promise;
}, updateStaleTimeout_fn = function() {
  __privateMethod(this, _QueryObserver_instances, clearStaleTimeout_fn).call(this);
  const staleTime = resolveStaleTime(
    this.options.staleTime,
    __privateGet(this, _currentQuery)
  );
  if (environmentManager.isServer() || __privateGet(this, _currentResult).isStale || !isValidTimeout(staleTime)) {
    return;
  }
  const time = timeUntilStale(__privateGet(this, _currentResult).dataUpdatedAt, staleTime);
  const timeout2 = time + 1;
  __privateSet(this, _staleTimeoutId, timeoutManager.setTimeout(() => {
    if (!__privateGet(this, _currentResult).isStale) {
      this.updateResult();
    }
  }, timeout2));
}, computeRefetchInterval_fn = function() {
  return (typeof this.options.refetchInterval === "function" ? this.options.refetchInterval(__privateGet(this, _currentQuery)) : this.options.refetchInterval) ?? false;
}, updateRefetchInterval_fn = function(nextInterval) {
  __privateMethod(this, _QueryObserver_instances, clearRefetchInterval_fn).call(this);
  __privateSet(this, _currentRefetchInterval, nextInterval);
  if (environmentManager.isServer() || resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) === false || !isValidTimeout(__privateGet(this, _currentRefetchInterval)) || __privateGet(this, _currentRefetchInterval) === 0) {
    return;
  }
  __privateSet(this, _refetchIntervalId, timeoutManager.setInterval(() => {
    if (this.options.refetchIntervalInBackground || focusManager.isFocused()) {
      __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this);
    }
  }, __privateGet(this, _currentRefetchInterval)));
}, updateTimers_fn = function() {
  __privateMethod(this, _QueryObserver_instances, updateStaleTimeout_fn).call(this);
  __privateMethod(this, _QueryObserver_instances, updateRefetchInterval_fn).call(this, __privateMethod(this, _QueryObserver_instances, computeRefetchInterval_fn).call(this));
}, clearStaleTimeout_fn = function() {
  if (__privateGet(this, _staleTimeoutId)) {
    timeoutManager.clearTimeout(__privateGet(this, _staleTimeoutId));
    __privateSet(this, _staleTimeoutId, void 0);
  }
}, clearRefetchInterval_fn = function() {
  if (__privateGet(this, _refetchIntervalId)) {
    timeoutManager.clearInterval(__privateGet(this, _refetchIntervalId));
    __privateSet(this, _refetchIntervalId, void 0);
  }
}, updateQuery_fn = function() {
  const query = __privateGet(this, _client).getQueryCache().build(__privateGet(this, _client), this.options);
  if (query === __privateGet(this, _currentQuery)) {
    return;
  }
  const prevQuery = __privateGet(this, _currentQuery);
  __privateSet(this, _currentQuery, query);
  __privateSet(this, _currentQueryInitialState, query.state);
  if (this.hasListeners()) {
    prevQuery == null ? void 0 : prevQuery.removeObserver(this);
    query.addObserver(this);
  }
}, notify_fn = function(notifyOptions) {
  notifyManager.batch(() => {
    if (notifyOptions.listeners) {
      this.listeners.forEach((listener) => {
        listener(__privateGet(this, _currentResult));
      });
    }
    __privateGet(this, _client).getQueryCache().notify({
      query: __privateGet(this, _currentQuery),
      type: "observerResultsUpdated"
    });
  });
}, _a);
function shouldLoadOnMount(query, options) {
  return resolveEnabled(options.enabled, query) !== false && query.state.data === void 0 && !(query.state.status === "error" && options.retryOnMount === false);
}
function shouldFetchOnMount(query, options) {
  return shouldLoadOnMount(query, options) || query.state.data !== void 0 && shouldFetchOn(query, options, options.refetchOnMount);
}
function shouldFetchOn(query, options, field) {
  if (resolveEnabled(options.enabled, query) !== false && resolveStaleTime(options.staleTime, query) !== "static") {
    const value = typeof field === "function" ? field(query) : field;
    return value === "always" || value !== false && isStale(query, options);
  }
  return false;
}
function shouldFetchOptionally(query, prevQuery, options, prevOptions) {
  return (query !== prevQuery || resolveEnabled(prevOptions.enabled, query) === false) && (!options.suspense || query.state.status !== "error") && isStale(query, options);
}
function isStale(query, options) {
  return resolveEnabled(options.enabled, query) !== false && query.isStaleByTime(resolveStaleTime(options.staleTime, query));
}
function shouldAssignObserverCurrentProperties(observer, optimisticResult) {
  if (!shallowEqualObjects(observer.getCurrentResult(), optimisticResult)) {
    return true;
  }
  return false;
}
var IsRestoringContext = reactExports.createContext(false);
var useIsRestoring = () => reactExports.useContext(IsRestoringContext);
IsRestoringContext.Provider;
function createValue() {
  let isReset = false;
  return {
    clearReset: () => {
      isReset = false;
    },
    reset: () => {
      isReset = true;
    },
    isReset: () => {
      return isReset;
    }
  };
}
var QueryErrorResetBoundaryContext = reactExports.createContext(createValue());
var useQueryErrorResetBoundary = () => reactExports.useContext(QueryErrorResetBoundaryContext);
var ensurePreventErrorBoundaryRetry = (options, errorResetBoundary, query) => {
  const throwOnError = (query == null ? void 0 : query.state.error) && typeof options.throwOnError === "function" ? shouldThrowError(options.throwOnError, [query.state.error, query]) : options.throwOnError;
  if (options.suspense || options.experimental_prefetchInRender || throwOnError) {
    if (!errorResetBoundary.isReset()) {
      options.retryOnMount = false;
    }
  }
};
var useClearResetErrorBoundary = (errorResetBoundary) => {
  reactExports.useEffect(() => {
    errorResetBoundary.clearReset();
  }, [errorResetBoundary]);
};
var getHasError = ({
  result,
  errorResetBoundary,
  throwOnError,
  query,
  suspense
}) => {
  return result.isError && !errorResetBoundary.isReset() && !result.isFetching && query && (suspense && result.data === void 0 || shouldThrowError(throwOnError, [result.error, query]));
};
var ensureSuspenseTimers = (defaultedOptions) => {
  if (defaultedOptions.suspense) {
    const MIN_SUSPENSE_TIME_MS = 1e3;
    const clamp = (value) => value === "static" ? value : Math.max(value ?? MIN_SUSPENSE_TIME_MS, MIN_SUSPENSE_TIME_MS);
    const originalStaleTime = defaultedOptions.staleTime;
    defaultedOptions.staleTime = typeof originalStaleTime === "function" ? (...args) => clamp(originalStaleTime(...args)) : clamp(originalStaleTime);
    if (typeof defaultedOptions.gcTime === "number") {
      defaultedOptions.gcTime = Math.max(
        defaultedOptions.gcTime,
        MIN_SUSPENSE_TIME_MS
      );
    }
  }
};
var willFetch = (result, isRestoring) => result.isLoading && result.isFetching && !isRestoring;
var shouldSuspend = (defaultedOptions, result) => (defaultedOptions == null ? void 0 : defaultedOptions.suspense) && result.isPending;
var fetchOptimistic = (defaultedOptions, observer, errorResetBoundary) => observer.fetchOptimistic(defaultedOptions).catch(() => {
  errorResetBoundary.clearReset();
});
function useBaseQuery(options, Observer, queryClient) {
  var _a2, _b, _c, _d;
  const isRestoring = useIsRestoring();
  const errorResetBoundary = useQueryErrorResetBoundary();
  const client = useQueryClient();
  const defaultedOptions = client.defaultQueryOptions(options);
  (_b = (_a2 = client.getDefaultOptions().queries) == null ? void 0 : _a2._experimental_beforeQuery) == null ? void 0 : _b.call(
    _a2,
    defaultedOptions
  );
  const query = client.getQueryCache().get(defaultedOptions.queryHash);
  defaultedOptions._optimisticResults = isRestoring ? "isRestoring" : "optimistic";
  ensureSuspenseTimers(defaultedOptions);
  ensurePreventErrorBoundaryRetry(defaultedOptions, errorResetBoundary, query);
  useClearResetErrorBoundary(errorResetBoundary);
  const isNewCacheEntry = !client.getQueryCache().get(defaultedOptions.queryHash);
  const [observer] = reactExports.useState(
    () => new Observer(
      client,
      defaultedOptions
    )
  );
  const result = observer.getOptimisticResult(defaultedOptions);
  const shouldSubscribe = !isRestoring && options.subscribed !== false;
  reactExports.useSyncExternalStore(
    reactExports.useCallback(
      (onStoreChange) => {
        const unsubscribe = shouldSubscribe ? observer.subscribe(notifyManager.batchCalls(onStoreChange)) : noop;
        observer.updateResult();
        return unsubscribe;
      },
      [observer, shouldSubscribe]
    ),
    () => observer.getCurrentResult(),
    () => observer.getCurrentResult()
  );
  reactExports.useEffect(() => {
    observer.setOptions(defaultedOptions);
  }, [defaultedOptions, observer]);
  if (shouldSuspend(defaultedOptions, result)) {
    throw fetchOptimistic(defaultedOptions, observer, errorResetBoundary);
  }
  if (getHasError({
    result,
    errorResetBoundary,
    throwOnError: defaultedOptions.throwOnError,
    query,
    suspense: defaultedOptions.suspense
  })) {
    throw result.error;
  }
  (_d = (_c = client.getDefaultOptions().queries) == null ? void 0 : _c._experimental_afterQuery) == null ? void 0 : _d.call(
    _c,
    defaultedOptions,
    result
  );
  if (defaultedOptions.experimental_prefetchInRender && !environmentManager.isServer() && willFetch(result, isRestoring)) {
    const promise = isNewCacheEntry ? (
      // Fetch immediately on render in order to ensure `.promise` is resolved even if the component is unmounted
      fetchOptimistic(defaultedOptions, observer, errorResetBoundary)
    ) : (
      // subscribe to the "cache promise" so that we can finalize the currentThenable once data comes in
      query == null ? void 0 : query.promise
    );
    promise == null ? void 0 : promise.catch(noop).finally(() => {
      observer.updateResult();
    });
  }
  return !defaultedOptions.notifyOnChangeProps ? observer.trackResult(result) : result;
}
function useQuery(options, queryClient) {
  return useBaseQuery(options, QueryObserver);
}
function hasAccessControl(actor) {
  return typeof actor === "object" && actor !== null && "_initializeAccessControl" in actor;
}
const ACTOR_QUERY_KEY = "actor";
function useActor(createActor2) {
  const { identity, isAuthenticated } = useInternetIdentity();
  const queryClient = useQueryClient();
  const actorQuery = useQuery({
    queryKey: [ACTOR_QUERY_KEY, identity == null ? void 0 : identity.getPrincipal().toString()],
    queryFn: async () => {
      if (!isAuthenticated) {
        return await createActorWithConfig(createActor2);
      }
      const actorOptions = {
        agentOptions: {
          identity
        }
      };
      const actor = await createActorWithConfig(createActor2, actorOptions);
      if (hasAccessControl(actor)) {
        await actor._initializeAccessControl();
      }
      return actor;
    },
    // Only refetch when identity changes
    staleTime: Number.POSITIVE_INFINITY,
    // This will cause the actor to be recreated when the identity changes
    enabled: true
  });
  reactExports.useEffect(() => {
    if (actorQuery.data) {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return !query.queryKey.includes(ACTOR_QUERY_KEY);
        }
      });
      queryClient.refetchQueries({
        predicate: (query) => {
          return !query.queryKey.includes(ACTOR_QUERY_KEY);
        }
      });
    }
  }, [actorQuery.data, queryClient]);
  return {
    actor: actorQuery.data || null,
    isFetching: actorQuery.isFetching
  };
}
const UserRole = Variant({
  "admin": Null,
  "user": Null,
  "guest": Null
});
const SubjectId = Nat;
const CreateQuestionPayload = Record({
  "text": Text,
  "subjectId": SubjectId,
  "correctOptionIndex": Nat,
  "options": Vec(Text)
});
const QuestionId = Nat;
const Timestamp = Int;
const Question = Record({
  "id": QuestionId,
  "createdAt": Timestamp,
  "text": Text,
  "subjectId": SubjectId,
  "correctOptionIndex": Nat,
  "options": Vec(Text)
});
const CreateSubjectPayload = Record({
  "name": Text,
  "timerMinutes": Opt(Nat),
  "description": Text
});
const Subject = Record({
  "id": SubjectId,
  "name": Text,
  "createdAt": Timestamp,
  "timerMinutes": Opt(Nat),
  "description": Text
});
const AttemptId = Nat;
const UserId = Principal$1;
const QuizAttemptPublic = Record({
  "id": AttemptId,
  "completedAt": Opt(Timestamp),
  "startedAt": Timestamp,
  "answers": Vec(Nat),
  "completed": Bool,
  "studentPrincipal": UserId,
  "scorePercentage": Nat,
  "score": Nat,
  "totalQuestions": Nat,
  "timeLimitMinutes": Opt(Nat),
  "subjectId": SubjectId
});
const StudentNameEntry = Record({
  "principal": UserId,
  "name": Text
});
const AttemptDetails = Record({
  "attempt": QuizAttemptPublic,
  "correctAnswers": Vec(Nat)
});
const CertificateId = Nat;
const Certificate = Record({
  "id": CertificateId,
  "completedAt": Timestamp,
  "studentId": UserId,
  "studentName": Text,
  "subjectName": Text,
  "score": Nat,
  "totalQuestions": Nat,
  "subjectId": SubjectId
});
const LeaderboardEntry = Record({
  "principal": UserId,
  "displayName": Text,
  "rank": Nat,
  "totalAttempts": Nat,
  "averageScore": Nat
});
const StudentProfilePublic = Record({
  "principal": UserId,
  "displayName": Text,
  "section": Text,
  "registerNumber": Text,
  "accentColor": Text,
  "department": Text,
  "registeredAt": Timestamp,
  "enrollNumber": Text
});
const StudentSummary = Record({
  "principal": UserId,
  "displayName": Text,
  "totalAttempts": Nat,
  "averageScore": Nat
});
const QuestionPublic = Record({
  "id": QuestionId,
  "createdAt": Timestamp,
  "text": Text,
  "subjectId": SubjectId,
  "options": Vec(Text)
});
const SubjectWithStats = Record({
  "id": SubjectId,
  "name": Text,
  "createdAt": Timestamp,
  "timerMinutes": Opt(Nat),
  "description": Text,
  "questionCount": Nat
});
const SubmitAnswersPayload = Record({
  "attemptId": AttemptId,
  "answers": Vec(Nat)
});
const SubmitQuizResult = Record({
  "attempt": QuizAttemptPublic,
  "correctAnswers": Vec(Nat)
});
const UpdateQuestionPayload = Record({
  "id": QuestionId,
  "text": Text,
  "subjectId": SubjectId,
  "correctOptionIndex": Nat,
  "options": Vec(Text)
});
const UpdateSubjectPayload = Record({
  "id": SubjectId,
  "name": Text,
  "timerMinutes": Opt(Nat),
  "description": Text
});
Service({
  "_initializeAccessControl": Func([], [], []),
  "assignCallerUserRole": Func([Principal$1, UserRole], [], []),
  "createQuestion": Func([CreateQuestionPayload], [Question], []),
  "createSubject": Func([CreateSubjectPayload], [Subject], []),
  "deleteQuestion": Func([QuestionId], [Bool], []),
  "deleteSubject": Func([SubjectId], [Bool], []),
  "generateCertificateShareToken": Func(
    [SubjectId],
    [Opt(Text)],
    []
  ),
  "getAllAttempts": Func([], [Vec(QuizAttemptPublic)], ["query"]),
  "getAllStudentNames": Func([], [Vec(StudentNameEntry)], ["query"]),
  "getAttemptDetails": Func(
    [AttemptId],
    [Opt(AttemptDetails)],
    ["query"]
  ),
  "getAttemptsByStudent": Func(
    [UserId],
    [Vec(QuizAttemptPublic)],
    ["query"]
  ),
  "getAttemptsBySubject": Func(
    [SubjectId],
    [Vec(QuizAttemptPublic)],
    ["query"]
  ),
  "getCallerUserRole": Func([], [UserRole], ["query"]),
  "getCertificateByToken": Func(
    [Text],
    [Opt(Certificate)],
    ["query"]
  ),
  "getCertificates": Func([], [Vec(Certificate)], ["query"]),
  "getLeaderboard": Func([], [Vec(LeaderboardEntry)], ["query"]),
  "getMyAttempts": Func([], [Vec(QuizAttemptPublic)], ["query"]),
  "getMyProfile": Func([], [StudentProfilePublic], []),
  "getSubjectCertificate": Func(
    [SubjectId],
    [Opt(Certificate)],
    ["query"]
  ),
  "isCallerAdmin": Func([], [Bool], ["query"]),
  "listAllStudents": Func([], [Vec(StudentSummary)], ["query"]),
  "listQuestionsBySubject": Func(
    [SubjectId],
    [Vec(QuestionPublic)],
    ["query"]
  ),
  "listQuestionsWithAnswers": Func(
    [SubjectId],
    [Vec(Question)],
    ["query"]
  ),
  "listSubjects": Func([], [Vec(SubjectWithStats)], ["query"]),
  "registerStudent": Func([], [StudentProfilePublic], []),
  "startQuiz": Func([SubjectId], [QuizAttemptPublic], []),
  "submitQuizAnswers": Func(
    [SubmitAnswersPayload],
    [SubmitQuizResult],
    []
  ),
  "updateMyAccentColor": Func([Text], [Bool], []),
  "updateMyDepartment": Func([Text], [Bool], []),
  "updateMyDisplayName": Func([Text], [Bool], []),
  "updateMyEnrollNumber": Func([Text], [Bool], []),
  "updateMyRegisterNumber": Func([Text], [Bool], []),
  "updateMySection": Func([Text], [Bool], []),
  "updateQuestion": Func([UpdateQuestionPayload], [Bool], []),
  "updateSubject": Func([UpdateSubjectPayload], [Bool], [])
});
const idlFactory = ({ IDL: IDL2 }) => {
  const UserRole2 = IDL2.Variant({
    "admin": IDL2.Null,
    "user": IDL2.Null,
    "guest": IDL2.Null
  });
  const SubjectId2 = IDL2.Nat;
  const CreateQuestionPayload2 = IDL2.Record({
    "text": IDL2.Text,
    "subjectId": SubjectId2,
    "correctOptionIndex": IDL2.Nat,
    "options": IDL2.Vec(IDL2.Text)
  });
  const QuestionId2 = IDL2.Nat;
  const Timestamp2 = IDL2.Int;
  const Question2 = IDL2.Record({
    "id": QuestionId2,
    "createdAt": Timestamp2,
    "text": IDL2.Text,
    "subjectId": SubjectId2,
    "correctOptionIndex": IDL2.Nat,
    "options": IDL2.Vec(IDL2.Text)
  });
  const CreateSubjectPayload2 = IDL2.Record({
    "name": IDL2.Text,
    "timerMinutes": IDL2.Opt(IDL2.Nat),
    "description": IDL2.Text
  });
  const Subject2 = IDL2.Record({
    "id": SubjectId2,
    "name": IDL2.Text,
    "createdAt": Timestamp2,
    "timerMinutes": IDL2.Opt(IDL2.Nat),
    "description": IDL2.Text
  });
  const AttemptId2 = IDL2.Nat;
  const UserId2 = IDL2.Principal;
  const QuizAttemptPublic2 = IDL2.Record({
    "id": AttemptId2,
    "completedAt": IDL2.Opt(Timestamp2),
    "startedAt": Timestamp2,
    "answers": IDL2.Vec(IDL2.Nat),
    "completed": IDL2.Bool,
    "studentPrincipal": UserId2,
    "scorePercentage": IDL2.Nat,
    "score": IDL2.Nat,
    "totalQuestions": IDL2.Nat,
    "timeLimitMinutes": IDL2.Opt(IDL2.Nat),
    "subjectId": SubjectId2
  });
  const StudentNameEntry2 = IDL2.Record({
    "principal": UserId2,
    "name": IDL2.Text
  });
  const AttemptDetails2 = IDL2.Record({
    "attempt": QuizAttemptPublic2,
    "correctAnswers": IDL2.Vec(IDL2.Nat)
  });
  const CertificateId2 = IDL2.Nat;
  const Certificate2 = IDL2.Record({
    "id": CertificateId2,
    "completedAt": Timestamp2,
    "studentId": UserId2,
    "studentName": IDL2.Text,
    "subjectName": IDL2.Text,
    "score": IDL2.Nat,
    "totalQuestions": IDL2.Nat,
    "subjectId": SubjectId2
  });
  const LeaderboardEntry2 = IDL2.Record({
    "principal": UserId2,
    "displayName": IDL2.Text,
    "rank": IDL2.Nat,
    "totalAttempts": IDL2.Nat,
    "averageScore": IDL2.Nat
  });
  const StudentProfilePublic2 = IDL2.Record({
    "principal": UserId2,
    "displayName": IDL2.Text,
    "section": IDL2.Text,
    "registerNumber": IDL2.Text,
    "accentColor": IDL2.Text,
    "department": IDL2.Text,
    "registeredAt": Timestamp2,
    "enrollNumber": IDL2.Text
  });
  const StudentSummary2 = IDL2.Record({
    "principal": UserId2,
    "displayName": IDL2.Text,
    "totalAttempts": IDL2.Nat,
    "averageScore": IDL2.Nat
  });
  const QuestionPublic2 = IDL2.Record({
    "id": QuestionId2,
    "createdAt": Timestamp2,
    "text": IDL2.Text,
    "subjectId": SubjectId2,
    "options": IDL2.Vec(IDL2.Text)
  });
  const SubjectWithStats2 = IDL2.Record({
    "id": SubjectId2,
    "name": IDL2.Text,
    "createdAt": Timestamp2,
    "timerMinutes": IDL2.Opt(IDL2.Nat),
    "description": IDL2.Text,
    "questionCount": IDL2.Nat
  });
  const SubmitAnswersPayload2 = IDL2.Record({
    "attemptId": AttemptId2,
    "answers": IDL2.Vec(IDL2.Nat)
  });
  const SubmitQuizResult2 = IDL2.Record({
    "attempt": QuizAttemptPublic2,
    "correctAnswers": IDL2.Vec(IDL2.Nat)
  });
  const UpdateQuestionPayload2 = IDL2.Record({
    "id": QuestionId2,
    "text": IDL2.Text,
    "subjectId": SubjectId2,
    "correctOptionIndex": IDL2.Nat,
    "options": IDL2.Vec(IDL2.Text)
  });
  const UpdateSubjectPayload2 = IDL2.Record({
    "id": SubjectId2,
    "name": IDL2.Text,
    "timerMinutes": IDL2.Opt(IDL2.Nat),
    "description": IDL2.Text
  });
  return IDL2.Service({
    "_initializeAccessControl": IDL2.Func([], [], []),
    "assignCallerUserRole": IDL2.Func([IDL2.Principal, UserRole2], [], []),
    "createQuestion": IDL2.Func([CreateQuestionPayload2], [Question2], []),
    "createSubject": IDL2.Func([CreateSubjectPayload2], [Subject2], []),
    "deleteQuestion": IDL2.Func([QuestionId2], [IDL2.Bool], []),
    "deleteSubject": IDL2.Func([SubjectId2], [IDL2.Bool], []),
    "generateCertificateShareToken": IDL2.Func(
      [SubjectId2],
      [IDL2.Opt(IDL2.Text)],
      []
    ),
    "getAllAttempts": IDL2.Func([], [IDL2.Vec(QuizAttemptPublic2)], ["query"]),
    "getAllStudentNames": IDL2.Func([], [IDL2.Vec(StudentNameEntry2)], ["query"]),
    "getAttemptDetails": IDL2.Func(
      [AttemptId2],
      [IDL2.Opt(AttemptDetails2)],
      ["query"]
    ),
    "getAttemptsByStudent": IDL2.Func(
      [UserId2],
      [IDL2.Vec(QuizAttemptPublic2)],
      ["query"]
    ),
    "getAttemptsBySubject": IDL2.Func(
      [SubjectId2],
      [IDL2.Vec(QuizAttemptPublic2)],
      ["query"]
    ),
    "getCallerUserRole": IDL2.Func([], [UserRole2], ["query"]),
    "getCertificateByToken": IDL2.Func(
      [IDL2.Text],
      [IDL2.Opt(Certificate2)],
      ["query"]
    ),
    "getCertificates": IDL2.Func([], [IDL2.Vec(Certificate2)], ["query"]),
    "getLeaderboard": IDL2.Func([], [IDL2.Vec(LeaderboardEntry2)], ["query"]),
    "getMyAttempts": IDL2.Func([], [IDL2.Vec(QuizAttemptPublic2)], ["query"]),
    "getMyProfile": IDL2.Func([], [StudentProfilePublic2], []),
    "getSubjectCertificate": IDL2.Func(
      [SubjectId2],
      [IDL2.Opt(Certificate2)],
      ["query"]
    ),
    "isCallerAdmin": IDL2.Func([], [IDL2.Bool], ["query"]),
    "listAllStudents": IDL2.Func([], [IDL2.Vec(StudentSummary2)], ["query"]),
    "listQuestionsBySubject": IDL2.Func(
      [SubjectId2],
      [IDL2.Vec(QuestionPublic2)],
      ["query"]
    ),
    "listQuestionsWithAnswers": IDL2.Func(
      [SubjectId2],
      [IDL2.Vec(Question2)],
      ["query"]
    ),
    "listSubjects": IDL2.Func([], [IDL2.Vec(SubjectWithStats2)], ["query"]),
    "registerStudent": IDL2.Func([], [StudentProfilePublic2], []),
    "startQuiz": IDL2.Func([SubjectId2], [QuizAttemptPublic2], []),
    "submitQuizAnswers": IDL2.Func(
      [SubmitAnswersPayload2],
      [SubmitQuizResult2],
      []
    ),
    "updateMyAccentColor": IDL2.Func([IDL2.Text], [IDL2.Bool], []),
    "updateMyDepartment": IDL2.Func([IDL2.Text], [IDL2.Bool], []),
    "updateMyDisplayName": IDL2.Func([IDL2.Text], [IDL2.Bool], []),
    "updateMyEnrollNumber": IDL2.Func([IDL2.Text], [IDL2.Bool], []),
    "updateMyRegisterNumber": IDL2.Func([IDL2.Text], [IDL2.Bool], []),
    "updateMySection": IDL2.Func([IDL2.Text], [IDL2.Bool], []),
    "updateQuestion": IDL2.Func([UpdateQuestionPayload2], [IDL2.Bool], []),
    "updateSubject": IDL2.Func([UpdateSubjectPayload2], [IDL2.Bool], [])
  });
};
function candid_some(value) {
  return [
    value
  ];
}
function candid_none() {
  return [];
}
function record_opt_to_undefined(arg) {
  return arg == null ? void 0 : arg;
}
class Backend {
  constructor(actor, _uploadFile, _downloadFile, processError) {
    this.actor = actor;
    this._uploadFile = _uploadFile;
    this._downloadFile = _downloadFile;
    this.processError = processError;
  }
  async _initializeAccessControl() {
    if (this.processError) {
      try {
        const result = await this.actor._initializeAccessControl();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor._initializeAccessControl();
      return result;
    }
  }
  async assignCallerUserRole(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.assignCallerUserRole(arg0, to_candid_UserRole_n1(this._uploadFile, this._downloadFile, arg1));
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.assignCallerUserRole(arg0, to_candid_UserRole_n1(this._uploadFile, this._downloadFile, arg1));
      return result;
    }
  }
  async createQuestion(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.createQuestion(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.createQuestion(arg0);
      return result;
    }
  }
  async createSubject(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.createSubject(to_candid_CreateSubjectPayload_n3(this._uploadFile, this._downloadFile, arg0));
        return from_candid_Subject_n5(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.createSubject(to_candid_CreateSubjectPayload_n3(this._uploadFile, this._downloadFile, arg0));
      return from_candid_Subject_n5(this._uploadFile, this._downloadFile, result);
    }
  }
  async deleteQuestion(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.deleteQuestion(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.deleteQuestion(arg0);
      return result;
    }
  }
  async deleteSubject(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.deleteSubject(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.deleteSubject(arg0);
      return result;
    }
  }
  async generateCertificateShareToken(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.generateCertificateShareToken(arg0);
        return from_candid_opt_n8(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.generateCertificateShareToken(arg0);
      return from_candid_opt_n8(this._uploadFile, this._downloadFile, result);
    }
  }
  async getAllAttempts() {
    if (this.processError) {
      try {
        const result = await this.actor.getAllAttempts();
        return from_candid_vec_n9(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getAllAttempts();
      return from_candid_vec_n9(this._uploadFile, this._downloadFile, result);
    }
  }
  async getAllStudentNames() {
    if (this.processError) {
      try {
        const result = await this.actor.getAllStudentNames();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getAllStudentNames();
      return result;
    }
  }
  async getAttemptDetails(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getAttemptDetails(arg0);
        return from_candid_opt_n13(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getAttemptDetails(arg0);
      return from_candid_opt_n13(this._uploadFile, this._downloadFile, result);
    }
  }
  async getAttemptsByStudent(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getAttemptsByStudent(arg0);
        return from_candid_vec_n9(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getAttemptsByStudent(arg0);
      return from_candid_vec_n9(this._uploadFile, this._downloadFile, result);
    }
  }
  async getAttemptsBySubject(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getAttemptsBySubject(arg0);
        return from_candid_vec_n9(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getAttemptsBySubject(arg0);
      return from_candid_vec_n9(this._uploadFile, this._downloadFile, result);
    }
  }
  async getCallerUserRole() {
    if (this.processError) {
      try {
        const result = await this.actor.getCallerUserRole();
        return from_candid_UserRole_n16(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getCallerUserRole();
      return from_candid_UserRole_n16(this._uploadFile, this._downloadFile, result);
    }
  }
  async getCertificateByToken(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getCertificateByToken(arg0);
        return from_candid_opt_n18(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getCertificateByToken(arg0);
      return from_candid_opt_n18(this._uploadFile, this._downloadFile, result);
    }
  }
  async getCertificates() {
    if (this.processError) {
      try {
        const result = await this.actor.getCertificates();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getCertificates();
      return result;
    }
  }
  async getLeaderboard() {
    if (this.processError) {
      try {
        const result = await this.actor.getLeaderboard();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getLeaderboard();
      return result;
    }
  }
  async getMyAttempts() {
    if (this.processError) {
      try {
        const result = await this.actor.getMyAttempts();
        return from_candid_vec_n9(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getMyAttempts();
      return from_candid_vec_n9(this._uploadFile, this._downloadFile, result);
    }
  }
  async getMyProfile() {
    if (this.processError) {
      try {
        const result = await this.actor.getMyProfile();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getMyProfile();
      return result;
    }
  }
  async getSubjectCertificate(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getSubjectCertificate(arg0);
        return from_candid_opt_n18(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getSubjectCertificate(arg0);
      return from_candid_opt_n18(this._uploadFile, this._downloadFile, result);
    }
  }
  async isCallerAdmin() {
    if (this.processError) {
      try {
        const result = await this.actor.isCallerAdmin();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.isCallerAdmin();
      return result;
    }
  }
  async listAllStudents() {
    if (this.processError) {
      try {
        const result = await this.actor.listAllStudents();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.listAllStudents();
      return result;
    }
  }
  async listQuestionsBySubject(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.listQuestionsBySubject(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.listQuestionsBySubject(arg0);
      return result;
    }
  }
  async listQuestionsWithAnswers(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.listQuestionsWithAnswers(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.listQuestionsWithAnswers(arg0);
      return result;
    }
  }
  async listSubjects() {
    if (this.processError) {
      try {
        const result = await this.actor.listSubjects();
        return from_candid_vec_n19(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.listSubjects();
      return from_candid_vec_n19(this._uploadFile, this._downloadFile, result);
    }
  }
  async registerStudent() {
    if (this.processError) {
      try {
        const result = await this.actor.registerStudent();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.registerStudent();
      return result;
    }
  }
  async startQuiz(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.startQuiz(arg0);
        return from_candid_QuizAttemptPublic_n10(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.startQuiz(arg0);
      return from_candid_QuizAttemptPublic_n10(this._uploadFile, this._downloadFile, result);
    }
  }
  async submitQuizAnswers(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.submitQuizAnswers(arg0);
        return from_candid_SubmitQuizResult_n22(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.submitQuizAnswers(arg0);
      return from_candid_SubmitQuizResult_n22(this._uploadFile, this._downloadFile, result);
    }
  }
  async updateMyAccentColor(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.updateMyAccentColor(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.updateMyAccentColor(arg0);
      return result;
    }
  }
  async updateMyDepartment(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.updateMyDepartment(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.updateMyDepartment(arg0);
      return result;
    }
  }
  async updateMyDisplayName(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.updateMyDisplayName(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.updateMyDisplayName(arg0);
      return result;
    }
  }
  async updateMyEnrollNumber(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.updateMyEnrollNumber(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.updateMyEnrollNumber(arg0);
      return result;
    }
  }
  async updateMyRegisterNumber(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.updateMyRegisterNumber(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.updateMyRegisterNumber(arg0);
      return result;
    }
  }
  async updateMySection(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.updateMySection(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.updateMySection(arg0);
      return result;
    }
  }
  async updateQuestion(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.updateQuestion(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.updateQuestion(arg0);
      return result;
    }
  }
  async updateSubject(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.updateSubject(to_candid_UpdateSubjectPayload_n23(this._uploadFile, this._downloadFile, arg0));
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.updateSubject(to_candid_UpdateSubjectPayload_n23(this._uploadFile, this._downloadFile, arg0));
      return result;
    }
  }
}
function from_candid_AttemptDetails_n14(_uploadFile, _downloadFile, value) {
  return from_candid_record_n15(_uploadFile, _downloadFile, value);
}
function from_candid_QuizAttemptPublic_n10(_uploadFile, _downloadFile, value) {
  return from_candid_record_n11(_uploadFile, _downloadFile, value);
}
function from_candid_SubjectWithStats_n20(_uploadFile, _downloadFile, value) {
  return from_candid_record_n21(_uploadFile, _downloadFile, value);
}
function from_candid_Subject_n5(_uploadFile, _downloadFile, value) {
  return from_candid_record_n6(_uploadFile, _downloadFile, value);
}
function from_candid_SubmitQuizResult_n22(_uploadFile, _downloadFile, value) {
  return from_candid_record_n15(_uploadFile, _downloadFile, value);
}
function from_candid_UserRole_n16(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n17(_uploadFile, _downloadFile, value);
}
function from_candid_opt_n12(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n13(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : from_candid_AttemptDetails_n14(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n18(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n7(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n8(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_record_n11(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    completedAt: record_opt_to_undefined(from_candid_opt_n12(_uploadFile, _downloadFile, value.completedAt)),
    startedAt: value.startedAt,
    answers: value.answers,
    completed: value.completed,
    studentPrincipal: value.studentPrincipal,
    scorePercentage: value.scorePercentage,
    score: value.score,
    totalQuestions: value.totalQuestions,
    timeLimitMinutes: record_opt_to_undefined(from_candid_opt_n7(_uploadFile, _downloadFile, value.timeLimitMinutes)),
    subjectId: value.subjectId
  };
}
function from_candid_record_n15(_uploadFile, _downloadFile, value) {
  return {
    attempt: from_candid_QuizAttemptPublic_n10(_uploadFile, _downloadFile, value.attempt),
    correctAnswers: value.correctAnswers
  };
}
function from_candid_record_n21(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    name: value.name,
    createdAt: value.createdAt,
    timerMinutes: record_opt_to_undefined(from_candid_opt_n7(_uploadFile, _downloadFile, value.timerMinutes)),
    description: value.description,
    questionCount: value.questionCount
  };
}
function from_candid_record_n6(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    name: value.name,
    createdAt: value.createdAt,
    timerMinutes: record_opt_to_undefined(from_candid_opt_n7(_uploadFile, _downloadFile, value.timerMinutes)),
    description: value.description
  };
}
function from_candid_variant_n17(_uploadFile, _downloadFile, value) {
  return "admin" in value ? "admin" : "user" in value ? "user" : "guest" in value ? "guest" : value;
}
function from_candid_vec_n19(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_SubjectWithStats_n20(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n9(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_QuizAttemptPublic_n10(_uploadFile, _downloadFile, x));
}
function to_candid_CreateSubjectPayload_n3(_uploadFile, _downloadFile, value) {
  return to_candid_record_n4(_uploadFile, _downloadFile, value);
}
function to_candid_UpdateSubjectPayload_n23(_uploadFile, _downloadFile, value) {
  return to_candid_record_n24(_uploadFile, _downloadFile, value);
}
function to_candid_UserRole_n1(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n2(_uploadFile, _downloadFile, value);
}
function to_candid_record_n24(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    name: value.name,
    timerMinutes: value.timerMinutes ? candid_some(value.timerMinutes) : candid_none(),
    description: value.description
  };
}
function to_candid_record_n4(_uploadFile, _downloadFile, value) {
  return {
    name: value.name,
    timerMinutes: value.timerMinutes ? candid_some(value.timerMinutes) : candid_none(),
    description: value.description
  };
}
function to_candid_variant_n2(_uploadFile, _downloadFile, value) {
  return value == "admin" ? {
    admin: null
  } : value == "user" ? {
    user: null
  } : value == "guest" ? {
    guest: null
  } : value;
}
function createActor(canisterId, _uploadFile, _downloadFile, options = {}) {
  const agent = options.agent || HttpAgent.createSync({
    ...options.agentOptions
  });
  if (options.agent && options.agentOptions) {
    console.warn("Detected both agent and agentOptions passed to createActor. Ignoring agentOptions and proceeding with the provided agent.");
  }
  const actor = Actor.createActor(idlFactory, {
    agent,
    canisterId,
    ...options.actorOptions
  });
  return new Backend(actor, _uploadFile, _downloadFile, options.processError);
}
export {
  useQuery as a,
  createActor as c,
  useActor as u
};
