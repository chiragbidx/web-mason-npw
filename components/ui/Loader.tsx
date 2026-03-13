// components/ui/Loader.tsx
import { Loader2 } from "lucide-react";

export default function Loader() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-6 bg-white">
      <div className="relative flex h-24 w-24 items-center justify-center">
        <div className="absolute h-full w-full animate-ping rounded-full bg-rose-100 opacity-75 duration-1000"></div>
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-rose-50 shadow-sm">
          <span className="text-4xl animate-bounce">🐼</span>
        </div>
        <div className="absolute -bottom-1 -right-1 rounded-full bg-white p-1 shadow-md">
          <Loader2 className="h-6 w-6 animate-spin text-rose-600" />
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 text-center">
        <h3 className="text-xl font-bold text-gray-900">PandaStay</h3>
        <p className="flex items-center gap-2 text-sm font-medium text-gray-500 animate-pulse">
          Preparing your getaway... 🏨 ✈️ 🌴
        </p>
      </div>
    </div>
  );
}
