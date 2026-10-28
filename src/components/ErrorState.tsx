import { AlertCircle, RefreshCcw } from "lucide-react";

interface ErrorStateProps {
    message: string;
    onRetry: () => void;
    isRetrying?: boolean;
}

export default function ErrorState({
    message,
    onRetry,
    isRetrying = false,
}: ErrorStateProps) {
    return(
        <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-8 text-center">
            <AlertCircle className="mb-3 h-8 w-8 text-red-500"/>

            <p className="text-sm text-slate-600">
                {message}
            </p>

            <button
                type="button"
                onClick={onRetry}
                disabled={isRetrying}
                className="mt-4 flex items-center gap-2 rounde-lg bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-700 disabled:opacity-50"
            >
                <RefreshCcw
                    size={10}
                    className={isRetrying ? "animate-spin" : ""}
                />
                {isRetrying ? "다시 요청 중.." : "다시 시도"}
            </button>
        </div>
    )
}