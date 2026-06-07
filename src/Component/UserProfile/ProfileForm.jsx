import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { createUserProfile, updateUserProfile } from "../Api/UserProfile";
import { API_URL } from "../Server/Server";
import { useAlert } from "../../ContextProvider/AlertContext";
import CommanInput from "../CommanComponent/CommanInput";

const ProfileForm = ({
  profileId,
  initialData,
  existingData,
  editing,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;
  const { showAlert } = useAlert();
  const [formData, setFormData] = useState({
    firstName: initialData?.firstName || "",
    lastName: initialData?.lastName || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    country: initialData?.country || "",
    city: initialData?.city || "",
    postalCode: initialData?.postalCode || "",
    imageurl: initialData?.imageurl || "",
  });

  useEffect(() => {
    if (editing && existingData) {
      setFormData(existingData);
    }
  }, [editing, existingData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("firstName", formData.firstName);
      data.append("lastName", formData.lastName);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("country", formData.country);
      data.append("city", formData.city);
      data.append("postalCode", formData.postalCode);
      if (formData.imageurl && formData.imageurl instanceof File) {
        data.append("imageurl", formData.imageurl);
      }

      if (profileId) {
        await updateUserProfile(profileId, data);
        showAlert("Updated successfully", "success");
      } else {
        const userId = localStorage.getItem("userId");
        await createUserProfile(userId, data);
        showAlert("Created successfully", "success");
      }

      onClose();
    } catch (err) {
      const backendMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message;
      showAlert(backendMessage || "Something went wrong", "error");
    }
  };

  const inputClass =
    "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#B52929]/35";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-gray-100 bg-white p-6 shadow-xl md:p-8"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-[#B52929]"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="potlin pr-10 text-2xl font-bold text-[var(--color-family)] md:text-3xl">
          {editing ? "Edit profile" : "Create profile"}
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Keep your details up to date for a smoother checkout experience.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <CommanInput
              label="First name"
              name="firstName"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              placeholder="Enter first name"
            />
            <CommanInput
              label="Last name"
              name="lastName"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              placeholder="Enter last name"
            />
            <CommanInput
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="Enter email"
            />
            <CommanInput
              label="Phone number"
              name="phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder="Enter phone number"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <CommanInput
              label="Country"
              name="country"
              value={formData.country}
              onChange={(e) =>
                setFormData({ ...formData, country: e.target.value })
              }
              placeholder="Enter country"
            />
            <CommanInput
              label="City / state"
              name="city"
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
              placeholder="Enter city or state"
            />
            <CommanInput
              label="Postal code"
              name="postalCode"
              value={formData.postalCode}
              onChange={(e) =>
                setFormData({ ...formData, postalCode: e.target.value })
              }
              placeholder="Enter postal code"
            />
            <div>
              <label
                className="mb-1 block text-sm font-medium text-gray-700"
                htmlFor="profile-image"
              >
                Profile image
              </label>
              <input
                id="profile-image"
                type="file"
                accept="image/*"
                name="imageurl"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    imageurl: e.target.files ? e.target.files[0] : null,
                  })
                }
                className={`${inputClass} cursor-pointer file:mr-3 file:rounded-md file:border-0 file:bg-[var(--color-family)]/10 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-[var(--color-family)]`}
              />
              {formData.imageurl && (
                <img
                  src={
                    formData.imageurl instanceof File
                      ? URL.createObjectURL(formData.imageurl)
                      : `${API_URL.replace(/\/$/, "")}${formData.imageurl}`
                  }
                  alt="Preview"
                  className="mt-3 h-20 w-20 rounded-full border-2 border-[var(--color-primary)] object-cover shadow-sm"
                />
              )}
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-[#B52929] px-8 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#9f2323] cursor-pointer"
            >
              {editing ? "Update profile" : "Create profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileForm;
