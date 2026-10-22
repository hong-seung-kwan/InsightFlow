interface HeaderProps {
    onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
    return (
        <header className="h-16 border-b px-6 flex items-center justify-between">

            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={onMenuClick}
                    aria-label="메뉴 열기"
                    className="md:hidden"
                >
                    ☰
                </button>

                <h2 className="text-lg font-semibold">
                    InsightFlow Admin
                </h2>
            </div>

            <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">
                    관리자
                </span>

                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-700 font-bold">
                        A
                    </span>
                </div>
            </div>
        </header>
    );
}
