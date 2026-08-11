export default function ErrorText({ id, message }: { id: string; message?: string }) {
  if (!message) return null;

  return (
    <p id={id} role="alert" className="mt-1 text-[11px] font-medium text-rose-600">
      {message}
    </p>
  );
}
