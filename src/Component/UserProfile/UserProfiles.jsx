import { useEffect, useState } from "react";
import ProfileForm from "./ProfileForm";
import { getUserProfile } from "../Api/UserProfile";
import { API_URL } from "../Server/Server";
import PageBreadcrumb from "../CommanComponent/PageBreadcrumb";

const profileImageSrc = (profile) => {
  if (!profile?.imageurl) return null;
  const base = API_URL.replace(/\/$/, "");
  const path = profile.imageurl;
  if (path.startsWith("http")) return path;
  return `${base}${path}`;
};

export default function UserProfiles() {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const refreshProfile = async () => {
      const userId = localStorage.getItem("userId");
      try {
        if (!profile) {
          if (!userId) {
            setProfile(null);
            return;
          }
          const res = await getUserProfile(userId);
          setProfile(res.data.data);
        }
      } catch (err) {
        setProfile(null);
      }
    };
    refreshProfile();
  }, []);

  const avatarSrc = profileImageSrc(profile);

  return (
    <div className="py-6">
      <div className="container mx-auto px-4 space-y-6">
        <PageBreadcrumb pageTitle="My Profile" />

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="potlin text-2xl font-bold text-[var(--color-family)] md:text-3xl">
              My Profile
            </h1>

            {profile ? (
              <button
                type="button"
                onClick={() => {
                  setEditing(true);
                  setShowModal(true);
                }}
                className="inline-flex items-center justify-center rounded-full bg-[#B52929] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#9f2323] cursor-pointer"
              >
                Edit Profile
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setShowModal(true);
                }}
                className="inline-flex items-center justify-center rounded-full bg-[#B52929] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#9f2323] cursor-pointer"
              >
                Create Profile
              </button>
            )}
          </div>

          <div className="mt-8 space-y-6">
            <div className="rounded-xl border border-gray-100 bg-gray-50/80 p-5 md:p-6">
              <div className="flex flex-col items-center gap-6 xl:flex-row xl:items-center">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-2 border-[var(--color-primary)] bg-white shadow-sm">
                  {avatarSrc ? (
                    <img
                      src={avatarSrc}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[var(--color-family)]/10 potlin text-2xl font-bold text-[var(--color-family)]">
                      {profile?.firstName?.[0] || profile?.email?.[0] || "?"}
                    </div>
                  )}
                </div>
                <div className="text-center xl:text-left">
                  <h2 className="potlin text-xl font-bold capitalize text-[var(--color-family)] md:text-2xl">
                    {profile
                      ? `${profile.firstName || ""} ${profile.lastName || ""}`.trim() ||
                        "Your profile"
                      : "No profile yet"}
                  </h2>
                  <div className="mt-2 flex flex-col items-center gap-1 text-sm text-gray-600 xl:flex-row xl:gap-3">
                    <span className="rounded-full bg-[#B52929]/10 px-3 py-0.5 font-medium text-[#B52929]">
                      Customer
                    </span>
                    {profile && (
                      <>
                        <span className="hidden text-gray-300 xl:inline">|</span>
                        <span>
                          {[profile.city, profile.country].filter(Boolean).join(", ") ||
                            "Add your location in profile"}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-100 bg-white p-5 md:p-6">
              <h3 className="potlin text-lg font-bold text-[var(--color-family)] md:text-xl">
                Personal information
              </h3>
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8">
                {[
                  { label: "First name", value: profile?.firstName },
                  { label: "Last name", value: profile?.lastName },
                  { label: "Email", value: profile?.email },
                  { label: "Phone", value: profile?.phone },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      {label}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      {value?.toString().trim() || "—"}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-gray-100 bg-white p-5 md:p-6">
              <h3 className="potlin text-lg font-bold text-[var(--color-family)] md:text-xl">
                Address
              </h3>
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8">
                {[
                  { label: "Country", value: profile?.country },
                  { label: "City / state", value: profile?.city },
                  { label: "Postal code", value: profile?.postalCode },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      {label}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      {value?.toString().trim() || "—"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProfileForm
        profileId={profile?._id}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        editing={editing}
        existingData={profile}
      />
    </div>
  );
}
