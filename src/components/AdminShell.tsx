"use client"

import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AdminShell({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isOpen, setIsOpen] = useState(false);

    function handleToggleMenu() {
        setIsOpen((prev) => !prev);
    }

    return (
        <div className="flex min-h-screen bg-slate-50 text-slate-900">
            {isOpen && (
                <button
                    type="button"
                    aria-label="메뉴 닫기"
                    className="fixed inset-0 z-40 bg-black/50 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
            <Sidebar
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                />
            <div className="flex min-h-screen flex-1 flex-col">
                <Header onMenuClick={handleToggleMenu} />
                <main className="flex-1 p-6">{children}</main>
            </div>
        </div>
    )
}