"use client";

import { useState, useEffect } from "react";
import { User, Mail, Save, Loader2, Calendar } from "lucide-react";
import { toast } from "react-hot-toast";
import Loader from "@/components/ui/Loader";

type UserProfile = {
  name: string | null;
  email: string;
  createdAt: string;
  _count: {
    bookings: number;
  };
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        } else {
          toast.error("Failed to load profile.");
        }
      } catch (error) {
        console.error("Failed to fetch profile", error);
        toast.error("An error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setUpdating(true);

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(profile),
      });

      if (res.ok) {
        toast.success("Profile updated successfully!");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Update failed", error);
      toast.error("An error occurred during update.");
    } finally {
      setUpdating(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (profile) {
      setProfile({ ...profile, [e.target.name]: e.target.value });
    }
  };

  if (loading) {
    return (
      <Loader />
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Failed to load profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-black mb-2">My Profile</h1>
        <p className="text-gray-600 mb-8">Manage your personal information.</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar: Stats & Info */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
              <div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-rose-600">
                  {profile.name?.[0]?.toUpperCase() || "U"}
                </span>
              </div>
              <h2 className="text-xl font-bold text-black">
                {profile.name || "User"}
              </h2>
              <p className="text-sm text-gray-500 mb-4">{profile.email}</p>

              <div className="border-t border-gray-100 pt-4 mt-4">
                <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider">
                  Member Since
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {new Date(profile.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="font-bold text-black mb-4">Your Activity</h3>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-rose-100 text-rose-600 rounded-lg">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    Total Bookings
                  </span>
                </div>
                <span className="text-lg font-bold text-black">
                  {profile._count?.bookings || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Right Content: Edit Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
              <h3 className="text-lg font-bold text-black mb-6">
                Edit Details
              </h3>
              <form onSubmit={handleUpdate} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-black mb-1"
                  >
                    Full Name
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={profile.name || ""}
                      onChange={handleChange}
                      className="block w-full rounded-lg border border-gray-300 pl-10 py-3 text-black focus:border-rose-500 focus:ring-rose-500 sm:text-sm transition-colors"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-black mb-1"
                  >
                    Email Address
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={profile.email}
                      onChange={handleChange}
                      className="block w-full rounded-lg border border-gray-300 pl-10 py-3 text-black focus:border-rose-500 focus:ring-rose-500 sm:text-sm transition-colors"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={updating}
                    className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50 transition-colors"
                  >
                    {updating ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Save className="w-5 h-5" />
                    )}
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
