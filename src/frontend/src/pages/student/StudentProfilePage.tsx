import { useBackend } from "@/hooks/useBackend";
import { StudentLayout } from "@/layouts/StudentLayout";
import type { StudentProfilePublic } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Camera, CheckCircle2, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const ACCENT_SWATCHES = [
  { label: "Default", value: "", display: "oklch(0.65 0.005 265)" },
  {
    label: "Blue",
    value: "oklch(0.6 0.15 240)",
    display: "oklch(0.6 0.15 240)",
  },
  {
    label: "Purple",
    value: "oklch(0.6 0.15 290)",
    display: "oklch(0.6 0.15 290)",
  },
  {
    label: "Green",
    value: "oklch(0.6 0.15 145)",
    display: "oklch(0.6 0.15 145)",
  },
  {
    label: "Orange",
    value: "oklch(0.7 0.15 50)",
    display: "oklch(0.7 0.15 50)",
  },
  {
    label: "Pink",
    value: "oklch(0.7 0.15 330)",
    display: "oklch(0.7 0.15 330)",
  },
];

const LS_KEY = "student-accent-color";
const PHOTO_LS_KEY_PREFIX = "student-photo-";

function getHeaderGradient(accentColor: string): string {
  if (!accentColor) {
    return "linear-gradient(135deg, oklch(0.55 0.22 200) 0%, oklch(0.45 0.24 250) 100%)";
  }
  // Parse the hue from the accent value for a cohesive gradient
  return `linear-gradient(135deg, ${accentColor} 0%, oklch(0.45 0.2 ${accentColor.match(/\d+\)?$/)?.[0]?.replace(")", "") ?? "250"}) 100%)`;
}

export function StudentProfilePage() {
  const { actor, isFetching } = useBackend();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: profile, isLoading } = useQuery<StudentProfilePublic | null>({
    queryKey: ["myProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyProfile();
    },
    enabled: !!actor && !isFetching,
  });

  const [displayName, setDisplayName] = useState("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [department, setDepartment] = useState("");
  const [registerNumber, setRegisterNumber] = useState("");
  const [enrollNumber, setEnrollNumber] = useState("");
  const [section, setSection] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<string>("");

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName ?? "");
      const saved = localStorage.getItem(LS_KEY) ?? "";
      setSelectedColor(profile.accentColor ?? saved ?? "");
      setDepartment(profile.department ?? "");
      setRegisterNumber(profile.registerNumber ?? "");
      setEnrollNumber(profile.enrollNumber ?? "");
      setSection(profile.section ?? "");
      // Load saved photo keyed by principal string
      const principalStr = profile.principal?.toString() ?? "default";
      const savedPhoto =
        localStorage.getItem(`${PHOTO_LS_KEY_PREFIX}${principalStr}`) ?? "";
      setProfilePhoto(savedPhoto);
    }
  }, [profile]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be smaller than 2MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      const principalStr = profile?.principal?.toString() ?? "default";
      localStorage.setItem(`${PHOTO_LS_KEY_PREFIX}${principalStr}`, dataUrl);
      setProfilePhoto(dataUrl);
      toast.success("Profile photo updated!");
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    const principalStr = profile?.principal?.toString() ?? "default";
    localStorage.removeItem(`${PHOTO_LS_KEY_PREFIX}${principalStr}`);
    setProfilePhoto("");
    toast.success("Profile photo removed.");
  };

  const updateNameMutation = useMutation({
    mutationFn: async (name: string) => {
      if (!actor) throw new Error("Not connected");
      await actor.updateMyDisplayName(name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
      toast.success("Display name updated!");
    },
    onError: () => toast.error("Failed to update display name."),
  });

  const updateDepartmentMutation = useMutation({
    mutationFn: async (value: string) => {
      if (!actor) throw new Error("Not connected");
      await actor.updateMyDepartment(value);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
      toast.success("Department updated!");
    },
    onError: () => toast.error("Failed to update department."),
  });

  const updateRegisterNumberMutation = useMutation({
    mutationFn: async (value: string) => {
      if (!actor) throw new Error("Not connected");
      await actor.updateMyRegisterNumber(value);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
      toast.success("Register number updated!");
    },
    onError: () => toast.error("Failed to update register number."),
  });

  const updateEnrollNumberMutation = useMutation({
    mutationFn: async (value: string) => {
      if (!actor) throw new Error("Not connected");
      await actor.updateMyEnrollNumber(value);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
      toast.success("Enroll number updated!");
    },
    onError: () => toast.error("Failed to update enroll number."),
  });

  const updateSectionMutation = useMutation({
    mutationFn: async (value: string) => {
      if (!actor) throw new Error("Not connected");
      await actor.updateMySection(value);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
      toast.success("Section updated!");
    },
    onError: () => toast.error("Failed to update section."),
  });

  const updateColorMutation = useMutation({
    mutationFn: async (color: string) => {
      if (!actor) throw new Error("Not connected");
      await actor.updateMyAccentColor(color);
    },
    onSuccess: (_data, color) => {
      localStorage.setItem(LS_KEY, color);
      setSelectedColor(color);
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
      toast.success("Accent color updated!");
    },
    onError: () => toast.error("Failed to update accent color."),
  });

  const currentAccent = selectedColor || (profile?.accentColor ?? "");
  const headerGradient = getHeaderGradient(currentAccent);

  return (
    <StudentLayout>
      <div
        className="p-6 md:p-10 max-w-2xl mx-auto"
        data-ocid="student_profile.page"
      >
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground tracking-tight">
            My Profile
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Personalize your name and accent color.
          </p>
        </div>

        {isLoading ? (
          <div
            className="rounded-2xl bg-card border border-border animate-pulse h-64"
            data-ocid="student_profile.loading_state"
          />
        ) : (
          <div
            className="rounded-2xl overflow-hidden border border-border shadow-lg bg-card"
            data-ocid="student_profile.card"
          >
            {/* Gradient header with photo upload */}
            <div
              className="h-32 flex items-end px-6 pb-4"
              style={{ background: headerGradient }}
            >
              <div className="relative group">
                <div
                  className="h-20 w-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg border-2 border-white/30 overflow-hidden"
                  style={{
                    background: profilePhoto
                      ? undefined
                      : "rgba(255,255,255,0.18)",
                  }}
                >
                  {profilePhoto ? (
                    <img
                      src={profilePhoto}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{(displayName || "?").charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                  aria-label="Upload profile photo"
                  data-ocid="student_profile.upload_button"
                >
                  <Camera className="h-6 w-6 text-white" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                  aria-label="Profile photo file input"
                />
              </div>
              {profilePhoto && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="ml-3 mb-1 text-white/70 hover:text-white text-xs underline transition-colors"
                  data-ocid="student_profile.remove_photo_button"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="p-6 space-y-8">
              {/* Photo hint */}
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" />
                Hover over your avatar to upload a profile photo (stored locally
                on this device).
              </p>

              {/* Display Name */}
              <section data-ocid="student_profile.name_section">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-3">
                  Display Name
                </h2>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Enter your display name"
                    className="flex-1 rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"
                    data-ocid="student_profile.name_input"
                  />
                  <button
                    type="button"
                    disabled={
                      updateNameMutation.isPending || !displayName.trim()
                    }
                    onClick={() =>
                      updateNameMutation.mutate(displayName.trim())
                    }
                    className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: currentAccent || "oklch(0.55 0.25 270)",
                    }}
                    data-ocid="student_profile.save_name_button"
                  >
                    {updateNameMutation.isPending ? "Saving…" : "Save"}
                  </button>
                </div>
              </section>

              {/* Academic Details */}
              <section data-ocid="student_profile.academic_section">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4">
                  Academic Details
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Department */}
                  <div>
                    <label
                      className="block text-xs font-medium text-muted-foreground mb-1.5"
                      htmlFor="dept-input"
                    >
                      Department
                    </label>
                    <div className="flex gap-2">
                      <input
                        id="dept-input"
                        type="text"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        placeholder="e.g. Computer Science"
                        className="flex-1 rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"
                        data-ocid="student_profile.department_input"
                      />
                      <button
                        type="button"
                        disabled={
                          updateDepartmentMutation.isPending ||
                          !department.trim()
                        }
                        onClick={() =>
                          updateDepartmentMutation.mutate(department.trim())
                        }
                        className="px-3 py-2 rounded-xl text-xs font-semibold text-white transition disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                        style={{
                          background: currentAccent || "oklch(0.55 0.25 270)",
                        }}
                        data-ocid="student_profile.save_department_button"
                      >
                        {updateDepartmentMutation.isPending ? "…" : "Save"}
                      </button>
                    </div>
                  </div>

                  {/* Section */}
                  <div>
                    <label
                      className="block text-xs font-medium text-muted-foreground mb-1.5"
                      htmlFor="section-input"
                    >
                      Section
                    </label>
                    <div className="flex gap-2">
                      <input
                        id="section-input"
                        type="text"
                        value={section}
                        onChange={(e) => setSection(e.target.value)}
                        placeholder="e.g. A, B, C"
                        className="flex-1 rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"
                        data-ocid="student_profile.section_input"
                      />
                      <button
                        type="button"
                        disabled={
                          updateSectionMutation.isPending || !section.trim()
                        }
                        onClick={() =>
                          updateSectionMutation.mutate(section.trim())
                        }
                        className="px-3 py-2 rounded-xl text-xs font-semibold text-white transition disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                        style={{
                          background: currentAccent || "oklch(0.55 0.25 270)",
                        }}
                        data-ocid="student_profile.save_section_button"
                      >
                        {updateSectionMutation.isPending ? "…" : "Save"}
                      </button>
                    </div>
                  </div>

                  {/* Register Number */}
                  <div>
                    <label
                      className="block text-xs font-medium text-muted-foreground mb-1.5"
                      htmlFor="regno-input"
                    >
                      Register Number
                    </label>
                    <div className="flex gap-2">
                      <input
                        id="regno-input"
                        type="text"
                        value={registerNumber}
                        onChange={(e) => setRegisterNumber(e.target.value)}
                        placeholder="e.g. 2021CS001"
                        className="flex-1 rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"
                        data-ocid="student_profile.register_number_input"
                      />
                      <button
                        type="button"
                        disabled={
                          updateRegisterNumberMutation.isPending ||
                          !registerNumber.trim()
                        }
                        onClick={() =>
                          updateRegisterNumberMutation.mutate(
                            registerNumber.trim(),
                          )
                        }
                        className="px-3 py-2 rounded-xl text-xs font-semibold text-white transition disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                        style={{
                          background: currentAccent || "oklch(0.55 0.25 270)",
                        }}
                        data-ocid="student_profile.save_register_number_button"
                      >
                        {updateRegisterNumberMutation.isPending ? "…" : "Save"}
                      </button>
                    </div>
                  </div>

                  {/* Enroll Number */}
                  <div>
                    <label
                      className="block text-xs font-medium text-muted-foreground mb-1.5"
                      htmlFor="enroll-input"
                    >
                      Enroll Number
                    </label>
                    <div className="flex gap-2">
                      <input
                        id="enroll-input"
                        type="text"
                        value={enrollNumber}
                        onChange={(e) => setEnrollNumber(e.target.value)}
                        placeholder="e.g. EN2021001"
                        className="flex-1 rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"
                        data-ocid="student_profile.enroll_number_input"
                      />
                      <button
                        type="button"
                        disabled={
                          updateEnrollNumberMutation.isPending ||
                          !enrollNumber.trim()
                        }
                        onClick={() =>
                          updateEnrollNumberMutation.mutate(enrollNumber.trim())
                        }
                        className="px-3 py-2 rounded-xl text-xs font-semibold text-white transition disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                        style={{
                          background: currentAccent || "oklch(0.55 0.25 270)",
                        }}
                        data-ocid="student_profile.save_enroll_number_button"
                      >
                        {updateEnrollNumberMutation.isPending ? "…" : "Save"}
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* Accent Color */}
              <section data-ocid="student_profile.color_section">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-3">
                  Accent Color
                </h2>
                <div className="flex flex-wrap gap-3">
                  {ACCENT_SWATCHES.map((swatch) => {
                    const isSelected = currentAccent === swatch.value;
                    return (
                      <button
                        key={swatch.value || "default"}
                        type="button"
                        title={swatch.label}
                        onClick={() => updateColorMutation.mutate(swatch.value)}
                        disabled={updateColorMutation.isPending}
                        className="relative h-10 w-10 rounded-xl border-2 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
                        style={{
                          background: swatch.display,
                          borderColor: isSelected
                            ? "oklch(0.9 0.005 265)"
                            : "transparent",
                          boxShadow: isSelected
                            ? `0 0 0 3px ${swatch.value || "oklch(0.65 0.005 265)"}`
                            : undefined,
                        }}
                        data-ocid={`student_profile.color_swatch.${swatch.label.toLowerCase()}`}
                      >
                        {isSelected && (
                          <CheckCircle2 className="h-4 w-4 absolute inset-0 m-auto text-white drop-shadow" />
                        )}
                      </button>
                    );
                  })}
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Your selected color:{" "}
                  <span className="font-medium text-foreground">
                    {ACCENT_SWATCHES.find((s) => s.value === currentAccent)
                      ?.label ?? "Default"}
                  </span>
                </p>
              </section>
            </div>
          </div>
        )}
      </div>
    </StudentLayout>
  );
}

export default StudentProfilePage;
