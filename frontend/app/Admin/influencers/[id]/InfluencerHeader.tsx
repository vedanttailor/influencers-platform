import { BadgeCheck} from "lucide-react";


export default function InfluencerHeader() {
return (
<div className="bg-white rounded-2xl p-6 shadow-sm flex justify-between items-center">
<div>
<h1 className="text-2xl font-semibold">Sunny (@sunny_creator)</h1>
<p className="text-sm text-gray-500">India • Joined Jan 2023 • Last Active 2 days ago</p>
</div>
<div className="flex items-center gap-3">
<span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm flex items-center gap-1">
<BadgeCheck size={14} /> Active
</span>
<span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm">Score: 4.3 ⭐</span>
</div>
</div>
);
}