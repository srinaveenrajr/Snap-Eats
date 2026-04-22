import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  fetchUserProfile,
  updateUserProfileData,
  clearError,
} from "../features/userSlice";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Home,
  Briefcase,
  Map,
  Save,
  ArrowLeft,
  Camera,
} from "lucide-react";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { profile, loading, error, isProfileComplete } = useSelector(
    (state) => state.user,
  );
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    addressLabel: "Home",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const fileInputRef = useRef(null);

  // Fetch profile on component mount
  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  // Update form data when profile is loaded
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        phone: profile.phone || "",
        address: profile.address || "",
        addressLabel: profile.addressLabel || "Home",
      });
    }
  }, [profile]);

  // Check if user was redirected from checkout
  const fromCheckout = location.state?.from?.pathname === "/checkout";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.name.trim() ||
      !formData.phone.trim() ||
      !formData.address.trim()
    ) {
      setSaveMessage("Please fill in all required fields");
      setTimeout(() => setSaveMessage(""), 3000);
      return;
    }

    // Phone validation
    if (!/^[0-9]{10}$/.test(formData.phone)) {
      setSaveMessage("Please enter a valid 10-digit phone number");
      setTimeout(() => setSaveMessage(""), 3000);
      return;
    }

    try {
      const result = await dispatch(updateUserProfileData(formData)).unwrap();
      setSaveMessage("Profile updated successfully!");
      setIsEditing(false);

      // If user was redirected from checkout and profile is now complete, redirect back
      if (fromCheckout && result.isProfileComplete) {
        setTimeout(() => {
          navigate("/checkout", { replace: true });
        }, 1500);
      }
    } catch (error) {
      setSaveMessage(error.error || "Failed to update profile");
    }

    setTimeout(() => setSaveMessage(""), 3000);
  };

  const handleUploadImage = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Selected file:", file);
      // Here you would typically handle the image upload to a server
      // e.g., using FormData and an API call
    }
  };

  const getAddressIcon = (label) => {
    switch (label) {
      case "Home":
        return <Home className="w-4 h-4" />;
      case "Work":
        return <Briefcase className="w-4 h-4" />;
      default:
        return <Map className="w-4 h-4" />;
    }
  };

  if (loading && !profile) {
    return (
      <div className="max-w-3xl mx-auto p-4">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 mt-20">
        <div className="flex items-center gap-3">
          {fromCheckout && (
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <h1 className="text-2xl font-bold">My Profile</h1>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`px-4 py-2 rounded-lg transition-colors ${
            isEditing
              ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
              : "bg-orange-500 text-white hover:bg-orange-600"
          }`}
        >
          {isEditing ? "Cancel" : "Edit"}
        </button>
      </div>

      {/* Profile Completion Alert */}
      {fromCheckout && !isProfileComplete && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-amber-800 mb-2">
            Complete Your Profile to Continue
          </h3>
          <p className="text-amber-700 text-sm">
            Please fill in your profile details to proceed with checkout.
          </p>
        </div>
      )}

      {/* Success/Error Messages */}
      {saveMessage && (
        <div
          className={`mb-4 p-3 rounded-lg ${
            saveMessage.includes("success")
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {saveMessage}
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 border border-red-200">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Profile Image Section */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-center">
          <div className="relative inline-block">
            <div className="w-24 h-24 rounded-full bg-white p-1">
              {profile?.profileImage ? (
                <img
                  src={profile.profileImage}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </div>
            <button
              onClick={handleUploadImage}
              className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:shadow-md transition-shadow"
            >
              <Camera className="w-4 h-4 text-gray-600" />
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </div>
          <h2 className="text-xl font-semibold text-white mt-3">
            {profile?.name || user?.name || "User"}
          </h2>
          <p className="text-orange-100 text-sm">
            {profile?.email || user?.email}
          </p>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSaveProfile} className="p-6 space-y-6">
          {/* Name Field */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4" />
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-50 disabled:text-gray-500"
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Email Field (Read-only) */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Mail className="w-4 h-4" />
              Email Address
            </label>
            <input
              type="email"
              value={profile?.email || user?.email || ""}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
              placeholder="Email cannot be changed"
            />
            <p className="text-xs text-gray-500 mt-1">
              Email address cannot be changed
            </p>
          </div>

          {/* Phone Field */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Phone className="w-4 h-4" />
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-50 disabled:text-gray-500"
              placeholder="Enter 10-digit phone number"
              maxLength="10"
              required
            />
          </div>

          {/* Address Field */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4" />
              Delivery Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              disabled={!isEditing}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-50 disabled:text-gray-500"
              placeholder="Enter your complete delivery address"
              required
            />
          </div>

          {/* Address Label */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              Address Type
            </label>
            <div className="flex gap-3">
              {["Home", "Work", "Other"].map((label) => (
                <label
                  key={label}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="addressLabel"
                    value={label}
                    checked={formData.addressLabel === label}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="text-orange-500 focus:ring-orange-500"
                  />
                  <span className="flex items-center gap-1 text-sm">
                    {getAddressIcon(label)}
                    {label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Profile Completion Status */}
          <div className="pt-4 border-t mb-15">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Profile Completion</span>
              <span
                className={`text-sm font-medium ${
                  isProfileComplete ? "text-green-600" : "text-amber-600"
                }`}
              >
                {isProfileComplete ? "Complete ✓" : "Incomplete"}
              </span>
            </div>
            {!isProfileComplete && (
              <p className="text-xs text-amber-600 mt-1">
                Complete your profile to enable checkout functionality
              </p>
            )}
          </div>

          {/* Save Button */}
          {isEditing && (
            <div className="flex gap-3 pt-4 mb-30">
              <button
                type="submit"
                className="flex-1 bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
