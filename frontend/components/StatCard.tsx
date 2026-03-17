type Props = {
  title: string
  value: string | number
}

export default function StatCard({ title, value }: Props) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition duration-200">
      <p className="text-gray-600 text-sm font-medium">
        {title}
      </p>
      <h2 className="text-gray-800 text-2xl font-bold mt-2">
        {value}
      </h2>
    </div>
  );
}