export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md overflow-hidden">
                <img 
                    src="/images/mv-oxygen-logo.png" 
                    alt="MV Oxygen Trading Logo" 
                    className="w-full h-full object-contain"
                />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-none font-semibold">MV Oxygen Trading</span>
            </div>
        </>
    );
}
