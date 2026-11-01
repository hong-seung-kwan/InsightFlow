import { useDataMode } from "../contexts/DataModeContext";

interface HeaderProps {
    onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
    const { mode, setMode } = useDataMode();
    return (
        <header className="h-16 border-b px-6 flex items-center justify-between">

            <div className="flex items-center gap-3">
                <div className="flex rounded-lg bg-slate-100 p-1">
                    <button
                        type="button"
                        onClick={() => setMode("demo")}
                        aria-pressed={mode === "demo"}
                        className={`rounded-md px-3 py-1.5 text-sm font-medium ${mode === "demo"
                                ? "bg-blue-600 text-white shadow-sm"
                                : "text-slate-600"
                            }`}
                    >
                        데모
                    </button>

                    <button
                        type="button"
                        onClick={() => setMode("shopify")}
                        aria-pressed={mode === "shopify"}
                        className={`rounded-md px-3 py-1.5 text-sm font-medium ${mode === "shopify"
                                ? "bg-blue-600 text-white shadow-sm"
                                : "text-slate-600"
                            }`}
                    >
                        Shopify
                    </button>
                </div>

                <span className="hidden text-sm text-gray-500 sm:inline">
                    관리자
                </span>

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100">
                    <span className="font-bold text-blue-700">A</span>
                </div>
            </div>
        </header>
    );
}
