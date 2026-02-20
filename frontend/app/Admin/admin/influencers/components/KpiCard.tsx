import { ReactNode } from 'react';

type KpiCardProps = {
  title: string;
  value: ReactNode;
};

export default function KpiCard({ title, value }: KpiCardProps) {
  return (
    <div className="bg-white p-5 rounded-xl shadow border">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="text-2xl font-bold mt-1">{value}</h2>
    </div>
  );
}
