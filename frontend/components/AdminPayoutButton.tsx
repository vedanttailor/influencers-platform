/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { api } from "@/lib/api";

interface Props {
  campaignId: string;
}

export default function AdminPayoutButton({
  campaignId,
}: Props) {

  const handlePayout = async () => {

    try {

      const data = await api.post(
        `/payout/pay-influencer/${campaignId}`
      );

      alert(data.message);

      console.log(data);

      window.location.reload();

    } catch (error: any) {

      console.error(error);

      alert(
        error?.response?.data?.detail ||
        "Payout failed"
      );
    }
  };

  return (
    <button
      onClick={handlePayout}
      className="
        bg-green-600
        hover:bg-green-700
        text-white
        px-4
        py-2
        rounded-lg
      "
    >
      Pay Influencer
    </button>
  );
}