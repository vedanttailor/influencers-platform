const platforms = [
{
name: "Instagram",
handle: "@sunny_insta",
followers: "125K",
engagement: "3.4%",
verified: true,
},
{
name: "YouTube",
handle: "Sunny Vlogs",
followers: "310K",
engagement: "4.1%",
verified: false,
},
];


export default function PlatformsTab() {
return (
<div className="bg-white rounded-2xl p-6 shadow-sm">
<h2 className="text-lg font-semibold mb-4">Social Platforms</h2>
<div className="space-y-4">
{platforms.map((p) => (
<div key={p.name} className="flex justify-between items-center border rounded-xl p-4">
<div>
<p className="font-medium">{p.name}</p>
<p className="text-sm text-gray-500">{p.handle}</p>
</div>
<div className="text-right">
<p>{p.followers} followers</p>
<p className="text-sm text-gray-500">Engagement {p.engagement}</p>
</div>
</div>
))}
</div>
</div>
);
}