interface AuthInputProps {
  label: string;
  type?: string;
  onChange: (value: string) => void;
}

export default function AuthInput({
  label,
  type = "text",
  onChange,
}: AuthInputProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type={type}
        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
