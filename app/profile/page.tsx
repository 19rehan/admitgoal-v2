"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function checkProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push("/login");
          return;
        }
        setUser(user);
        const { data, error } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("user_id", user.id)
          .single();
        if (error || !data) {
          router.push("/profile/create");
          return;
        }
        setProfile(data);
        setLoading(false);
      } catch (err) {
        console.error("Error loading profile:", err);
        router.push("/profile/create");
      }
    }
    checkProfile();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "oklch(0.12 0.03 280)" }}>
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p style={{ color: "oklch(0.72 0.03 285)" }}>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4" style={{ background: "oklch(0.12 0.03 280)" }}>
      <div className="max-w-2xl mx-auto">
        <div className="rounded-2xl p-8 border" style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(10px)", borderColor: "rgba(255,255,255,0.1)" }}>
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-white">My Profile</h1>
            <button onClick={() => router.push("/profile/edit")} className="px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: "oklch(0.62 0.21 280)" }}>Edit Profile</button>
          </div>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white" style={{ background: "oklch(0.62 0.21 280)" }}>{profile.full_name ? profile.full_name.charAt(0).toUpperCase() : "U"}</div>
            <div>
              <h2 className="text-xl font-semibold text-white">{profile.full_name || "No name set"}</h2>
              <p style={{ color: "oklch(0.72 0.03 285)" }}>{user?.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProfileField label="Country" value={profile.country} />
            <ProfileField label="Degree Level" value={profile.degree_level} />
            <ProfileField label="Field of Study" value={profile.field_of_study} />
            <ProfileField label="GPA" value={profile.gpa ? profile.gpa + "/4.0" : null} />
            <ProfileField label="IELTS Score" value={profile.ielts_score} />
            <ProfileField label="Preferred Countries" value={Array.isArray(profile.preferred_countries) ? profile.preferred_countries.join(", ") : profile.preferred_countries} />
          </div>
          <div className="mt-8 pt-6 border-t" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
            <button onClick={() => router.push("/dashboard")} className="px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: "rgba(255,255,255,0.1)" }}>Back to Dashboard</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileField({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <p className="text-xs font-medium mb-1" style={{ color: "oklch(0.72 0.03 285)" }}>{label}</p>
      <p className="text-white font-medium">{value || "Not set"}</p>
    </div>
  );
}