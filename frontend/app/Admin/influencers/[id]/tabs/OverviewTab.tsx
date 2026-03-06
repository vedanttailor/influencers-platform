export default function OverviewTab() {
return (
<div className="bg-white rounded-2xl p-6 shadow-sm">
<h2 className="text-lg font-semibold mb-4">Profile Overview</h2>
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
<Stat label="Total Followers" value="1.2M" />
<Stat label="Avg Engagement" value="3.6%" />
<Stat label="Campaigns" value="42" />
<Stat label="On-Time Rate" value="96%" />
</div>
</div>
);
}


function Stat({ label, value }: { label: string; value: string }) {
return (
<div className="rounded-xl bg-gray-50 p-4">
<p className="text-xs text-gray-500">{label}</p>
<p className="text-xl font-semibold">{value}</p>
</div>
);
}