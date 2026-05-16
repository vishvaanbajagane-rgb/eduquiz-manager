import { c as createLucideIcon, b as useQueryClient, r as reactExports, j as jsxRuntimeExports } from "./index-Hh1gENll.js";
import { a as useActor, c as createActor, b as useQuery } from "./backend-Bub9mio5.js";
import { S as StudentLayout, U as User } from "./StudentLayout-CFKi020B.js";
import { u as useMutation, a as ue } from "./index-CLu1Ust6.js";
import { C as CircleCheck } from "./circle-check-BCDIuKY2.js";
import "./badge-EMKhFOLg.js";
import "./sparkles-Bf1D91Qa.js";
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
function useBackend() {
  const { actor, isFetching } = useActor(createActor);
  return { actor, isFetching };
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
  const { data: profile, isLoading } = useQuery({
    queryKey: ["myProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyProfile();
    },
    enabled: !!actor && !isFetching
  });
  const [displayName, setDisplayName] = reactExports.useState("");
  const [selectedColor, setSelectedColor] = reactExports.useState("");
  const [department, setDepartment] = reactExports.useState("");
  const [registerNumber, setRegisterNumber] = reactExports.useState("");
  const [enrollNumber, setEnrollNumber] = reactExports.useState("");
  const [section, setSection] = reactExports.useState("");
  const [profilePhoto, setProfilePhoto] = reactExports.useState("");
  reactExports.useEffect(() => {
    var _a2;
    if (profile) {
      setDisplayName(profile.displayName ?? "");
      const saved = localStorage.getItem(LS_KEY) ?? "";
      setSelectedColor(profile.accentColor ?? saved ?? "");
      setDepartment(profile.department ?? "");
      setRegisterNumber(profile.registerNumber ?? "");
      setEnrollNumber(profile.enrollNumber ?? "");
      setSection(profile.section ?? "");
      const principalStr = ((_a2 = profile.principal) == null ? void 0 : _a2.toString()) ?? "default";
      const savedPhoto = localStorage.getItem(`${PHOTO_LS_KEY_PREFIX}${principalStr}`) ?? "";
      setProfilePhoto(savedPhoto);
    }
  }, [profile]);
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
      const principalStr = ((_b = profile == null ? void 0 : profile.principal) == null ? void 0 : _b.toString()) ?? "default";
      localStorage.setItem(`${PHOTO_LS_KEY_PREFIX}${principalStr}`, dataUrl);
      setProfilePhoto(dataUrl);
      ue.success("Profile photo updated!");
    };
    reader.readAsDataURL(file);
  };
  const handleRemovePhoto = () => {
    var _a2;
    const principalStr = ((_a2 = profile == null ? void 0 : profile.principal) == null ? void 0 : _a2.toString()) ?? "default";
    localStorage.removeItem(`${PHOTO_LS_KEY_PREFIX}${principalStr}`);
    setProfilePhoto("");
    ue.success("Profile photo removed.");
  };
  const updateNameMutation = useMutation({
    mutationFn: async (name) => {
      if (!actor) throw new Error("Not connected");
      await actor.updateMyDisplayName(name);
    },
    onSuccess: () => {
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
    onSuccess: () => {
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
    onSuccess: () => {
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
    onSuccess: () => {
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
    onSuccess: () => {
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
  return /* @__PURE__ */ jsxRuntimeExports.jsx(StudentLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "p-6 md:p-10 max-w-2xl mx-auto",
      "data-ocid": "student_profile.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-display font-bold text-foreground tracking-tight", children: "My Profile" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1 text-sm", children: "Personalize your name and accent color." })
        ] }),
        isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "rounded-2xl bg-card border border-border animate-pulse h-64",
            "data-ocid": "student_profile.loading_state"
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
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
                        "div",
                        {
                          className: "h-20 w-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg border-2 border-white/30 overflow-hidden",
                          style: {
                            background: profilePhoto ? void 0 : "rgba(255,255,255,0.18)"
                          },
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
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => {
                            var _a2;
                            return (_a2 = fileInputRef.current) == null ? void 0 : _a2.click();
                          },
                          className: "absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer",
                          "aria-label": "Upload profile photo",
                          "data-ocid": "student_profile.upload_button",
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "h-6 w-6 text-white" })
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
                  "Hover over your avatar to upload a profile photo (stored locally on this device)."
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "student_profile.name_section", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-3", children: "Display Name" }),
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
  ) });
}
export {
  StudentProfilePage,
  StudentProfilePage as default
};
