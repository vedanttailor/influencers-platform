export default function RatingsTab() {
return (
<div className="bg-white rounded-2xl p-6 shadow-sm">
<h2 className="text-lg font-semibold mb-4">System Ratings</h2>
<div className="grid grid-cols-2 gap-4">
<Rating label="Engagement" value={4.5} />
<Rating label="Reliability" value={4.2} />
<Rating label="Brand Safety" value={4.8} />
<Rating label="Campaign Success" value={4.1} />
</div>
</div>
);
}


function Rating({ label, value }: { label: string; value: number }) {
return (
<div className="bg-gray-50 rounded-xl p-4">
<p className="text-xs text-gray-500">{label}</p>
<p className="text-xl font-semibold">{value} ⭐</p>
</div>
);
}