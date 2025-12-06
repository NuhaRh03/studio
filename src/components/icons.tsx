import { cn } from "@/lib/utils";

export function Logo(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn("h-6 w-6", props.className)}
            {...props}
        >
            <path d="M12 2a10 10 0 1 0 10 10" />
            <path d="M12 2A10 10 0 0 1 22 12" />
            <path d="M12 2a10 10 0 0 0-3.5 19.3" />
            <path d="M12 2a10 10 0 0 1 3.5 19.3" />
            <path d="M2 12h20" />
            <path d="M17.5 19.3a10 10 0 0 1-11 0" />
            <path d="M6.5 4.7a10 10 0 0 1 11 0" />
            <path d="M12 2v20" />
        </svg>
    );
}
