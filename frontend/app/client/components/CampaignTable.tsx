interface Campaign {
  title: string;
  status: string;
  category: string;
  start: string;
  budget: number;
}

export default function CampaignCard({ campaign }: { campaign: Campaign }) {
  return (
    <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">

      <div className="flex justify-between items-center">

        <h3 className="text-lg font-semibold">
          {campaign.title}
        </h3>

        <span className="text-xs px-3 py-1 rounded-full bg-green-600">
          {campaign.status}
        </span>

      </div>

      <p className="text-sm text-slate-400 mt-2">
        {campaign.category}
      </p>

      <div className="mt-4 flex justify-between text-sm text-slate-400">
        <span>{campaign.start}</span>
        <span>₹{campaign.budget}</span>
      </div>

      <div className="flex gap-3 mt-4">

        <button className="px-3 py-1 bg-slate-800 rounded">
          View
        </button>

        <button className="px-3 py-1 bg-indigo-600 rounded">
          Edit
        </button>

      </div>

    </div>
  );
}