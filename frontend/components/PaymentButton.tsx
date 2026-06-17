/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { api } from "@/lib/api";
import toast from "react-hot-toast";

interface Props {
  campaignId: string;
}

export default function PaymentButton({
  campaignId,
}: Props) {

  // GET LOGGED-IN USER

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const handlePayment = async () => {

    try {

      // CREATE ORDER

      const data = await api.post(
        `/payment/create-order/${campaignId}`
      );

      console.log("ORDER DATA:", data);

      const options = {

        key: data.key,

        amount: data.total_amount * 100,

        currency: "INR",

        name: "Influencer CRM",

        description: "Campaign Payment",

        order_id: data.order_id,

        handler: async function (response: any) {

          try {

            // VERIFY PAYMENT

            const verifyData = await api.post(
              "/payment/verify-payment",
              {
                razorpay_order_id:
                  response.razorpay_order_id,

                razorpay_payment_id:
                  response.razorpay_payment_id,

                razorpay_signature:
                  response.razorpay_signature,
              }
            );

            console.log(
              "VERIFY DATA:",
              verifyData
            );

            if (verifyData.success) {

              toast.success("Payment Successful");

              window.location.href =
                "/client/campaigns";

            } else {

             toast.error("Payment Verification Failed");
            }

          } catch (verifyError) {

            console.error(
              "VERIFY ERROR:",
              verifyError
            );

           toast.error("Razorpay SDK failed to load");
          }
        },

        prefill: {

          name:user.full_name,

          email:user.email ,

          contact:user.phone,
        },

        theme: {
          color: "#2563eb",
        },
      };

      console.log("OPTIONS:", options);

      // CHECK RAZORPAY SDK

      if (!(window as any).Razorpay) {

        toast.error("Razorpay SDK failed to load");

        return;
      }

      // OPEN RAZORPAY POPUP

      const razorpay =
        new (window as any).Razorpay(
          options
        );

      razorpay.open();

    } catch (error: any) {

      console.error(
        "RAZORPAY ERROR:",
        error
      );

      toast.error("Payment Failed");
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="
        bg-blue-600
        hover:bg-blue-700
        text-white
        px-4
        py-2
        rounded-lg
      "
    >
      Pay Now
    </button>
  );
}