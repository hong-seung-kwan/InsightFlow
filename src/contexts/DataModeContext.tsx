"use client";

import {
    createContext,
    useContext,
    useSyncExternalStore,
} from "react";

export type DataMode = "shopify" | "demo";

interface DataModeContextType {
    mode: DataMode;
    setMode: (mode: DataMode) => void;
}

const DataModeContext =
    createContext<DataModeContextType | null>(null);

const STORAGE_KEY = "insightflow-mode";
const MODE_CHANGE_EVENT = "insightflow-mode-change";

function subscribe(callback: () => void) {
    window.addEventListener(MODE_CHANGE_EVENT, callback);
    window.addEventListener("storage", callback);

    return () => {
        window.removeEventListener(MODE_CHANGE_EVENT, callback);
        window.removeEventListener("storage", callback);
    };
}

function getSnapshot(): DataMode {
    const savedMode = localStorage.getItem(STORAGE_KEY);

    return savedMode === "shopify" ? "shopify" : "demo";
}

function getServerSnapshot(): DataMode {
    return "demo";
}

export function DataModeProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const mode = useSyncExternalStore(
        subscribe,
        getSnapshot,
        getServerSnapshot
    );

    function setMode(nextMode: DataMode) {
        localStorage.setItem(STORAGE_KEY, nextMode);

        window.dispatchEvent(
            new Event(MODE_CHANGE_EVENT)
        );
    }

    return (
        <DataModeContext.Provider value={{ mode, setMode }}>
            {children}
        </DataModeContext.Provider>
    );
}

export function useDataMode() {
    const context = useContext(DataModeContext);

    if (!context) {
        throw new Error(
            "useDataMode는 DataModeProvider 내부에서 사용해야 합니다."
        );
    }

    return context;
}