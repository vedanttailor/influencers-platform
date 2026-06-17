/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import Link from "next/link";

export default function UserDetailsPage() {
  const params = useParams();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await api.get(`/admin/users/${params.id}`);
        setUser(data);
      } catch (error) {
        console.error("Failed to load user", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      loadUser();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold">Loading user...</h2>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold text-red-500">User not found</h2>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/Admin/dashboard"
          className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-100 transition"
        >
          ← Back to Users
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center gap-6">
          <img
            src={user.profile_img || "/default-avatar.png"}
            alt={user.full_name}
            className="h-28 w-28 rounded-full object-cover border"
          />

          <div>
            <h1 className="text-3xl font-bold">{user.full_name}</h1>

            <p className="text-gray-500 mt-1">{user.role}</p>

            <span
              className={`inline-block mt-3 px-3 py-1 rounded-full text-sm ${
                user.status === "active"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {user.status}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="border-b p-4">
          <h2 className="font-semibold text-lg">Basic Information</h2>
        </div>

        <table className="w-full">
          <tbody>
            <InfoRow label="Full Name" value={user.full_name} />

            <InfoRow label="Email" value={user.email} />

            <InfoRow label="Phone" value={user.phone || "-"} />

            <InfoRow label="Role" value={user.role} />

            <InfoRow label="UPI ID" value={user.upi_id || "-"} />

            <InfoRow
              label="Created At"
              value={
                user.created_at
                  ? new Date(user.created_at).toLocaleString()
                  : "-"
              }
            />

            <InfoRow
              label="Last Login"
              value={
                user.last_login
                  ? new Date(user.last_login).toLocaleString()
                  : "-"
              }
            />
          </tbody>
        </table>
      </div>

      {(user.instagram_url || user.youtube_url) && (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="border-b p-4">
            <h2 className="font-semibold text-lg">Social Media Information</h2>
          </div>

          <table className="w-full">
            <tbody>
              <InfoRow
                label="Instagram Username"
                value={user.instagram_username || "-"}
              />

              <InfoRow
                label="Instagram URL"
                value={user.instagram_url || "-"}
              />

              <InfoRow label="Followers" value={user.followers_count || 0} />

              <InfoRow
                label="Engagement Rate"
                value={`${user.engagement_rate || 0}%`}
              />

              <InfoRow label="YouTube URL" value={user.youtube_url || "-"} />

              <InfoRow
                label="Channel Name"
                value={user.youtube_channel_name || "-"}
              />

              <InfoRow
                label="Channel ID"
                value={user.youtube_channel_id || "-"}
              />

              <InfoRow
                label="Subscribers"
                value={user.youtube_subscribers || 0}
              />

              <InfoRow label="Views" value={user.youtube_views || 0} />

              <InfoRow label="Videos" value={user.youtube_videos || 0} />
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: any }) {
  return (
    <tr className="border-b">
      <td className="bg-gray-50 p-4 font-medium w-[250px]">{label}</td>
      <td className="p-4">{value}</td>
    </tr>
  );
}
