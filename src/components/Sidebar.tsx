"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const menus = [
    { label: "대시보드", href: "/dashboard" },
    { label: "분석", href: "/analytics" },
    { label: "고객", href: "/customers" },
    { label: "주문", href: "/orders" },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();

    return (
        <aside
            className={`
                ${isOpen ? "block" : "hidden"}
                fixed inset-y-0 left-0 z-50
                w-60 border-r p-5
                bg-white text-gray-900
                md:static md:block md:shrink-0
                md:min-h-screen
            `}
        >
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">
                    InsightFlow
                </h2>

                <button
                    type="button"
                    onClick={onClose}
                    aria-label="메뉴 닫기"
                    className="md:hidden rounded-lg p-2 hover:bg-gray-100"
                >
                    ✕
                </button>
            </div>

            <nav className="mt-5">
                {menus.map((menu) => {
                    const isActive = pathname === menu.href;
                    return (
                        <Link
                            key={menu.href}
                            href={menu.href}
                            onClick={onClose}
                            className={`block rounded-lg px-4 py-3 ${
                                isActive
                                    ? "bg-blue-100 text-blue-700 font-semibold"
                                    : "hover:bg-gray-500"
                                }`}
                        >

                            {menu.label}
                        </Link>
                    )
                })}
            </nav>
        </aside>
    )
}