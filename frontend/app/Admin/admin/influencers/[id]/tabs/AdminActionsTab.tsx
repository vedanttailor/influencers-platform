export default function AdminActionsTab() {
return (
<div className="bg-white rounded-2xl p-6 shadow-sm">
<h2 className="text-lg font-semibold mb-4">Admin Actions</h2>
<div className="space-y-3">
<button className="w-full bg-green-600 text-white py-2 rounded-xl">Approve</button>
<button className="w-full bg-yellow-500 text-white py-2 rounded-xl">Suspend</button>
<button className="w-full bg-red-600 text-white py-2 rounded-xl">Blacklist</button>
</div>
<textarea
placeholder="Reason (required)"
className="mt-4 w-full border rounded-xl p-3 text-sm"
/>
</div>
);
}