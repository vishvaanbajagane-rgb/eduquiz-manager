import { c as createLucideIcon, b as useQueryClient, r as reactExports, j as jsxRuntimeExports } from "./index-bpXuEzrw.js";
import { u as useBackend } from "./useBackend-D-E_DhLf.js";
import { S as StudentLayout, U as User } from "./StudentLayout-CZu8a_js.js";
import { a as useQuery } from "./backend-CCEFFmVU.js";
import { u as useMutation, a as ue } from "./index-BnyW8Eih.js";
import { A as Award } from "./award-CTtKm_rv.js";
import { C as CircleCheck } from "./circle-check-B-IIa1lg.js";
import "./index-Cxvel48n.js";
import "./dialog-BJ8WYbYb.js";
import "./useAuth-C9wYs-_s.js";
import "./sparkles-D5fEc57q.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z",
      key: "1tc9qg"
    }
  ],
  ["circle", { cx: "12", cy: "13", r: "3", key: "1vg3eu" }]
];
const Camera = createLucideIcon("camera", __iconNode);
function isPrincipalId(s) {
  if (!s) return false;
  if (/^[a-z0-9]{5}(-[a-z0-9]{5}){3}-[a-z0-9]{3}$/.test(s)) return true;
  if (/^[a-z2-7]{5,}(-[a-z2-7]{5,}){4,}$/.test(s)) return true;
  if (s.length > 20 && (s.match(/-/g) ?? []).length >= 4 && /^[a-z0-9-]+$/.test(s))
    return true;
  return false;
}
function sanitizeName(raw) {
  const s = (raw == null ? void 0 : raw.trim()) ?? "";
  return isPrincipalId(s) ? "" : s;
}
const ACCENT_SWATCHES = [
  { label: "Default", value: "", display: "oklch(0.65 0.005 265)" },
  {
    label: "Blue",
    value: "oklch(0.6 0.15 240)",
    display: "oklch(0.6 0.15 240)"
  },
  {
    label: "Purple",
    value: "oklch(0.6 0.15 290)",
    display: "oklch(0.6 0.15 290)"
  },
  {
    label: "Green",
    value: "oklch(0.6 0.15 145)",
    display: "oklch(0.6 0.15 145)"
  },
  {
    label: "Orange",
    value: "oklch(0.7 0.15 50)",
    display: "oklch(0.7 0.15 50)"
  },
  {
    label: "Pink",
    value: "oklch(0.7 0.15 330)",
    display: "oklch(0.7 0.15 330)"
  }
];
const LS_KEY = "student-accent-color";
const PHOTO_LS_KEY_PREFIX = "student-photo-";
function getHeaderGradient(accentColor) {
  var _a, _b;
  if (!accentColor) {
    return "linear-gradient(135deg, oklch(0.55 0.22 200) 0%, oklch(0.45 0.24 250) 100%)";
  }
  return `linear-gradient(135deg, ${accentColor} 0%, oklch(0.45 0.2 ${((_b = (_a = accentColor.match(/\d+\)?$/)) == null ? void 0 : _a[0]) == null ? void 0 : _b.replace(")", "")) ?? "250"}) 100%)`;
}
function StudentProfilePage() {
  var _a;
  const { actor, isFetching } = useBackend();
  const queryClient = useQueryClient();
  const fileInputRef = reactExports.useRef(null);
  const {
    data: profile,
    isLoading,
    isFetched
  } = useQuery({
    queryKey: ["myProfile"],
    queryFn: async () => {
      if (!actor) return null;
      const result = await actor.getMyProfile();
      return result ?? null;
    },
    enabled: !!actor && !isFetching,
    staleTime: 0,
    refetchOnMount: true
  });
  const [displayName, setDisplayName] = reactExports.useState("");
  const [selectedColor, setSelectedColor] = reactExports.useState("");
  const [department, setDepartment] = reactExports.useState("");
  const [registerNumber, setRegisterNumber] = reactExports.useState("");
  const [enrollNumber, setEnrollNumber] = reactExports.useState("");
  const [section, setSection] = reactExports.useState("");
  const [profilePhoto, setProfilePhoto] = reactExports.useState("");
  const [photoViewOpen, setPhotoViewOpen] = reactExports.useState(false);
  const [initialized, setInitialized] = reactExports.useState(false);
  reactExports.useEffect(() => {
    var _a2;
    if (profile && isFetched) {
      setDisplayName(sanitizeName(profile.displayName));
      const saved = localStorage.getItem(LS_KEY) ?? "";
      setSelectedColor(profile.accentColor ?? saved ?? "");
      setDepartment(profile.department ?? "");
      setRegisterNumber(profile.registerNumber ?? "");
      setEnrollNumber(profile.enrollNumber ?? "");
      setSection(profile.section ?? "");
      const principalStr = ((_a2 = profile.principal) == null ? void 0 : _a2.toText) ? profile.principal.toText() : String(profile.principal);
      const savedPhoto = localStorage.getItem(`${PHOTO_LS_KEY_PREFIX}${principalStr}`) ?? "";
      setProfilePhoto(savedPhoto);
      setInitialized(true);
    }
  }, [profile, isFetched]);
  const handlePhotoUpload = (e) => {
    var _a2;
    const file = (_a2 = e.target.files) == null ? void 0 : _a2[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      ue.error("Please select a valid image file.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      ue.error("Image must be smaller than 2MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      var _a3, _b;
      const dataUrl = (_a3 = ev.target) == null ? void 0 : _a3.result;
      const principalStr = ((_b = profile == null ? void 0 : profile.principal) == null ? void 0 : _b.toText) ? profile.principal.toText() : String((profile == null ? void 0 : profile.principal) ?? "default");
      localStorage.setItem(`${PHOTO_LS_KEY_PREFIX}${principalStr}`, dataUrl);
      setProfilePhoto(dataUrl);
      ue.success("Profile photo updated!");
    };
    reader.readAsDataURL(file);
  };
  const handleRemovePhoto = () => {
    var _a2;
    const principalStr = ((_a2 = profile == null ? void 0 : profile.principal) == null ? void 0 : _a2.toText) ? profile.principal.toText() : String((profile == null ? void 0 : profile.principal) ?? "default");
    localStorage.removeItem(`${PHOTO_LS_KEY_PREFIX}${principalStr}`);
    setProfilePhoto("");
    ue.success("Profile photo removed.");
  };
  const updateNameMutation = useMutation({
    mutationFn: async (name) => {
      if (!actor) throw new Error("Not connected");
      await actor.updateMyDisplayName(name);
    },
    onSuccess: (_data, name) => {
      setDisplayName(name);
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
      ue.success("Display name updated!");
    },
    onError: () => ue.error("Failed to update display name.")
  });
  const updateDepartmentMutation = useMutation({
    mutationFn: async (value) => {
      if (!actor) throw new Error("Not connected");
      await actor.updateMyDepartment(value);
    },
    onSuccess: (_data, value) => {
      setDepartment(value);
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
      ue.success("Department updated!");
    },
    onError: () => ue.error("Failed to update department.")
  });
  const updateRegisterNumberMutation = useMutation({
    mutationFn: async (value) => {
      if (!actor) throw new Error("Not connected");
      await actor.updateMyRegisterNumber(value);
    },
    onSuccess: (_data, value) => {
      setRegisterNumber(value);
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
      ue.success("Register number updated!");
    },
    onError: () => ue.error("Failed to update register number.")
  });
  const updateEnrollNumberMutation = useMutation({
    mutationFn: async (value) => {
      if (!actor) throw new Error("Not connected");
      await actor.updateMyEnrollNumber(value);
    },
    onSuccess: (_data, value) => {
      setEnrollNumber(value);
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
      ue.success("Enroll number updated!");
    },
    onError: () => ue.error("Failed to update enroll number.")
  });
  const updateSectionMutation = useMutation({
    mutationFn: async (value) => {
      if (!actor) throw new Error("Not connected");
      await actor.updateMySection(value);
    },
    onSuccess: (_data, value) => {
      setSection(value);
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
      ue.success("Section updated!");
    },
    onError: () => ue.error("Failed to update section.")
  });
  const updateColorMutation = useMutation({
    mutationFn: async (color) => {
      if (!actor) throw new Error("Not connected");
      await actor.updateMyAccentColor(color);
    },
    onSuccess: (_data, color) => {
      localStorage.setItem(LS_KEY, color);
      setSelectedColor(color);
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
      ue.success("Accent color updated!");
    },
    onError: () => ue.error("Failed to update accent color.")
  });
  const currentAccent = selectedColor || ((profile == null ? void 0 : profile.accentColor) ?? "");
  const headerGradient = getHeaderGradient(currentAccent);
  const showSkeleton = isLoading || isFetching && !isFetched || !initialized && !isFetched;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(StudentLayout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "p-6 md:p-10 max-w-2xl mx-auto",
        "data-ocid": "student_profile.page",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-display font-bold text-foreground tracking-tight", children: "My Profile" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1 text-sm", children: "Personalize your name, academic details, and accent color." })
          ] }),
          showSkeleton ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-ocid": "student_profile.loading_state", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl bg-card border border-border animate-pulse h-32" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl bg-card border border-border animate-pulse h-48" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl bg-card border border-border animate-pulse h-24" })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "rounded-2xl overflow-hidden border border-border shadow-lg bg-card",
              "data-ocid": "student_profile.card",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "h-32 flex items-end px-6 pb-4",
                    style: { background: headerGradient },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            type: "button",
                            className: "h-20 w-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg border-2 border-white/30 overflow-hidden cursor-pointer",
                            style: {
                              background: profilePhoto ? void 0 : "rgba(255,255,255,0.18)"
                            },
                            onClick: () => {
                              var _a2;
                              if (profilePhoto) setPhotoViewOpen(true);
                              else (_a2 = fileInputRef.current) == null ? void 0 : _a2.click();
                            },
                            "aria-label": profilePhoto ? "View profile photo" : "Upload profile photo",
                            "data-ocid": "student_profile.photo_viewer",
                            children: profilePhoto ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "img",
                              {
                                src: profilePhoto,
                                alt: "Profile",
                                className: "w-full h-full object-cover"
                              }
                            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: (displayName || "?").charAt(0).toUpperCase() })
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity pointer-events-none", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "h-6 w-6 text-white" }) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            type: "button",
                            onClick: () => {
                              var _a2;
                              return (_a2 = fileInputRef.current) == null ? void 0 : _a2.click();
                            },
                            className: "sr-only",
                            "aria-label": "Upload profile photo",
                            "data-ocid": "student_profile.upload_button"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "input",
                          {
                            ref: fileInputRef,
                            type: "file",
                            accept: "image/*",
                            className: "hidden",
                            onChange: handlePhotoUpload,
                            "aria-label": "Profile photo file input"
                          }
                        )
                      ] }),
                      profilePhoto && /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          onClick: handleRemovePhoto,
                          className: "ml-3 mb-1 text-white/70 hover:text-white text-xs underline transition-colors",
                          "data-ocid": "student_profile.remove_photo_button",
                          children: "Remove"
                        }
                      )
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-8", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-3.5 w-3.5" }),
                    "Click your avatar to upload or change your profile photo (stored locally on this device). Tap to view full size."
                  ] }),
                  profilePhoto && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border",
                      "data-ocid": "student_profile.photo_preview",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            type: "button",
                            onClick: () => setPhotoViewOpen(true),
                            className: "shrink-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-ring",
                            "aria-label": "View full size profile photo",
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "img",
                              {
                                src: profilePhoto,
                                alt: "Profile avatar",
                                className: "h-16 w-16 rounded-xl object-cover border-2 border-border shadow hover:scale-105 transition-transform"
                              }
                            )
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: displayName || "Your Name" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Click photo to view full size" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "button",
                            {
                              type: "button",
                              onClick: () => {
                                var _a2;
                                return (_a2 = fileInputRef.current) == null ? void 0 : _a2.click();
                              },
                              className: "mt-1.5 text-xs text-primary underline underline-offset-2 hover:opacity-80 transition-opacity",
                              "data-ocid": "student_profile.change_photo_button",
                              children: "Change photo"
                            }
                          )
                        ] })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "student_profile.name_section", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-1", children: "Display Name" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mb-3 flex items-center gap-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "h-3 w-3 text-amber-500" }),
                      "This name will appear on your certificates — make sure it's your real name."
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          type: "text",
                          value: displayName,
                          onChange: (e) => setDisplayName(e.target.value),
                          placeholder: "Enter your display name",
                          className: "flex-1 rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition",
                          "data-ocid": "student_profile.name_input"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          disabled: updateNameMutation.isPending || !displayName.trim(),
                          onClick: () => updateNameMutation.mutate(displayName.trim()),
                          className: "px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition disabled:opacity-50 disabled:cursor-not-allowed",
                          style: {
                            background: currentAccent || "oklch(0.55 0.25 270)"
                          },
                          "data-ocid": "student_profile.save_name_button",
                          children: updateNameMutation.isPending ? "Saving…" : "Save"
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "student_profile.academic_section", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4", children: "Academic Details" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "label",
                          {
                            className: "block text-xs font-medium text-muted-foreground mb-1.5",
                            htmlFor: "dept-input",
                            children: "Department"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "input",
                            {
                              id: "dept-input",
                              type: "text",
                              value: department,
                              onChange: (e) => setDepartment(e.target.value),
                              placeholder: "e.g. Computer Science",
                              className: "flex-1 rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition",
                              "data-ocid": "student_profile.department_input"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "button",
                            {
                              type: "button",
                              disabled: updateDepartmentMutation.isPending || !department.trim(),
                              onClick: () => updateDepartmentMutation.mutate(department.trim()),
                              className: "px-3 py-2 rounded-xl text-xs font-semibold text-white transition disabled:opacity-50 disabled:cursor-not-allowed shrink-0",
                              style: {
                                background: currentAccent || "oklch(0.55 0.25 270)"
                              },
                              "data-ocid": "student_profile.save_department_button",
                              children: updateDepartmentMutation.isPending ? "…" : "Save"
                            }
                          )
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "label",
                          {
                            className: "block text-xs font-medium text-muted-foreground mb-1.5",
                            htmlFor: "section-input",
                            children: "Section"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "input",
                            {
                              id: "section-input",
                              type: "text",
                              value: section,
                              onChange: (e) => setSection(e.target.value),
                              placeholder: "e.g. A, B, C",
                              className: "flex-1 rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition",
                              "data-ocid": "student_profile.section_input"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "button",
                            {
                              type: "button",
                              disabled: updateSectionMutation.isPending || !section.trim(),
                              onClick: () => updateSectionMutation.mutate(section.trim()),
                              className: "px-3 py-2 rounded-xl text-xs font-semibold text-white transition disabled:opacity-50 disabled:cursor-not-allowed shrink-0",
                              style: {
                                background: currentAccent || "oklch(0.55 0.25 270)"
                              },
                              "data-ocid": "student_profile.save_section_button",
                              children: updateSectionMutation.isPending ? "…" : "Save"
                            }
                          )
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "label",
                          {
                            className: "block text-xs font-medium text-muted-foreground mb-1.5",
                            htmlFor: "regno-input",
                            children: "Register Number"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "input",
                            {
                              id: "regno-input",
                              type: "text",
                              value: registerNumber,
                              onChange: (e) => setRegisterNumber(e.target.value),
                              placeholder: "e.g. 2021CS001",
                              className: "flex-1 rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition",
                              "data-ocid": "student_profile.register_number_input"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "button",
                            {
                              type: "button",
                              disabled: updateRegisterNumberMutation.isPending || !registerNumber.trim(),
                              onClick: () => updateRegisterNumberMutation.mutate(
                                registerNumber.trim()
                              ),
                              className: "px-3 py-2 rounded-xl text-xs font-semibold text-white transition disabled:opacity-50 disabled:cursor-not-allowed shrink-0",
                              style: {
                                background: currentAccent || "oklch(0.55 0.25 270)"
                              },
                              "data-ocid": "student_profile.save_register_number_button",
                              children: updateRegisterNumberMutation.isPending ? "…" : "Save"
                            }
                          )
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "label",
                          {
                            className: "block text-xs font-medium text-muted-foreground mb-1.5",
                            htmlFor: "enroll-input",
                            children: "Enroll Number"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "input",
                            {
                              id: "enroll-input",
                              type: "text",
                              value: enrollNumber,
                              onChange: (e) => setEnrollNumber(e.target.value),
                              placeholder: "e.g. EN2021001",
                              className: "flex-1 rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition",
                              "data-ocid": "student_profile.enroll_number_input"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "button",
                            {
                              type: "button",
                              disabled: updateEnrollNumberMutation.isPending || !enrollNumber.trim(),
                              onClick: () => updateEnrollNumberMutation.mutate(enrollNumber.trim()),
                              className: "px-3 py-2 rounded-xl text-xs font-semibold text-white transition disabled:opacity-50 disabled:cursor-not-allowed shrink-0",
                              style: {
                                background: currentAccent || "oklch(0.55 0.25 270)"
                              },
                              "data-ocid": "student_profile.save_enroll_number_button",
                              children: updateEnrollNumberMutation.isPending ? "…" : "Save"
                            }
                          )
                        ] })
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "student_profile.color_section", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-3", children: "Accent Color" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-3", children: ACCENT_SWATCHES.map((swatch) => {
                      const isSelected = currentAccent === swatch.value;
                      return /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          title: swatch.label,
                          onClick: () => updateColorMutation.mutate(swatch.value),
                          disabled: updateColorMutation.isPending,
                          className: "relative h-10 w-10 rounded-xl border-2 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60",
                          style: {
                            background: swatch.display,
                            borderColor: isSelected ? "oklch(0.9 0.005 265)" : "transparent",
                            boxShadow: isSelected ? `0 0 0 3px ${swatch.value || "oklch(0.65 0.005 265)"}` : void 0
                          },
                          "data-ocid": `student_profile.color_swatch.${swatch.label.toLowerCase()}`,
                          children: isSelected && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 absolute inset-0 m-auto text-white drop-shadow" })
                        },
                        swatch.value || "default"
                      );
                    }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-xs text-muted-foreground", children: [
                      "Your selected color:",
                      " ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: ((_a = ACCENT_SWATCHES.find((s) => s.value === currentAccent)) == null ? void 0 : _a.label) ?? "Default" })
                    ] })
                  ] })
                ] })
              ]
            }
          )
        ]
      }
    ),
    photoViewOpen && profilePhoto && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "fixed inset-0 z-[9999] bg-black/90 flex flex-col items-center justify-center cursor-zoom-out",
        role: "presentation",
        onClick: () => setPhotoViewOpen(false),
        onKeyDown: (e) => e.key === "Escape" && setPhotoViewOpen(false),
        "data-ocid": "student_profile.photo_modal",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "dialog",
          {
            "aria-label": "Profile photo full view",
            className: "relative flex flex-col items-center bg-transparent border-0 p-0 open:flex",
            onClick: (e) => e.stopPropagation(),
            onKeyDown: (e) => e.key === "Escape" && setPhotoViewOpen(false),
            tabIndex: -1,
            open: true,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: profilePhoto,
                  alt: displayName || "Profile photo",
                  className: "max-w-[90vw] max-h-[75vh] rounded-2xl object-contain shadow-2xl"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-white/60 text-xs", children: "Tap outside or press Esc to close" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex items-center justify-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      setPhotoViewOpen(false);
                      setTimeout(() => {
                        var _a2;
                        return (_a2 = fileInputRef.current) == null ? void 0 : _a2.click();
                      }, 100);
                    },
                    className: "px-4 py-2 rounded-xl text-sm font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors",
                    "data-ocid": "student_profile.photo_modal_change_button",
                    children: "Change Photo"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setPhotoViewOpen(false),
                    className: "px-4 py-2 rounded-xl text-sm font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors",
                    "data-ocid": "student_profile.photo_modal_close_button",
                    children: "Close"
                  }
                )
              ] })
            ]
          }
        )
      }
    )
  ] });
}
export {
  StudentProfilePage,
  StudentProfilePage as default
};
