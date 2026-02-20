export default function Modal({
  title,
  message,
  close,
}: {
  title: string;
  message: string;
  close: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl text-center w-80">
        <h2 className="font-bold mb-2">{title}</h2>
        <p className="text-gray-600 mb-4">{message}</p>
        <button
          onClick={close}
          className="bg-black text-white px-4 py-2 rounded"
        >
          OK
        </button>
      </div>
    </div>
  );
}
