"use client";

import { useState } from "react";
import toast from "react-hot-toast";

interface Props {
  campaignId: string;
}

export default function AdminPayoutButton({
  campaignId,
}: Props) {

  const [loading, setLoading] =
    useState(false);

  const handlePayout = async () => {

    try {

      setLoading(true);

      const res = await fetch(
        `http://127.0.0.1:8000/payout/pay-influencer/${campaignId}`,
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await res.json();

      console.log(data);

      if (res.ok) {

        toast.success(
          data.message ||
          "Payout Successful"
        );

        setTimeout(() => {

          window.location.reload();

        }, 1500);

      } else {

        toast.error(
          data.detail ||
          "Payout Failed"
        );
      }

    } catch (error) {

      console.error(error);

      toast.error(
        "Server Error"
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <button
      onClick={handlePayout}
      disabled={loading}
      className={`
        px-4
        py-2
        rounded-lg
        text-white
        transition
        duration-200

        ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700"
        }
      `}
    >

      {loading
        ? "Processing..."
        : "Pay Influencer"}

    </button>

  );
}