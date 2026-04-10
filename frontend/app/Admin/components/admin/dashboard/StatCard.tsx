type Props = {
  title: string;
  value: string;
};

export default function StatCard({ title, value }: Props) {
  return (
    <div className="card p-5">
      <p className="text-sm font-medium text-slate-600">{title}</p>
      <h3 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
        {value}
      </h3>
    </div>
  );
}
