import { cn } from "@/lib/utils";

export function Logo(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn("h-6 w-6", props.className)}
            {...props}
        >
            <path d="M15.5 12.5a.5.5 0 10-1 0 .5.5 0 001 0z" />
            <path d="M16 9.5a.5.5 0 10-1 0 .5.5 0 001 0z" />
            <path d="M16.28 15.11a.5.5 0 10-1 0 .5.5 0 001 0z" />
            <path d="M18.8 12.5h-3.3" />
            <path d="M18.3 9.5h-2.3" />
            <path d="M18.57 15.11h-2.29" />
            <path d="M21.3 12.5h-1" />
            <path d="M11.5 13.5c-1 0-1.5-.5-2.5-2.5s-1.5-4-2.5-4-1.5 1.5-1.5 3.5 1.5 4.5 3 5.5 2.5 1 4 1" />
            <path d="M11.5 13.5v-1.5a2 2 0 014-1.5V9.5a2 2 0 00-2.5-2 2 2 0 00-2.5 2" />
            <path d="M12.5 13.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
            <path d="M14.5 15a1 1 0 10-2 0 1 1 0 002 0z" />
            <path d="M9 16.5a1 1 0 10-2 0 1 1 0 002 0z" />
            <path d="M9.5 19a.5.5 0 10-1 0 .5.5 0 001 0z" />
            <path d="M12.5 16.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
            <path d="M18.5 3.5a8 8 0 10-12.2 11.3 10.5 10.5 0 01-1.3 3.7c-.3.8.3 1.7 1.2 1.7.5 0 1-.2 1.3-.6a8 8 0 009-15.1z" />
            <path d="M10.83 11.33L10 9.5l-1.42 3.32" />
            <path d="M11.41 11.33l.8-1.83.8 1.83" />
        </svg>
    );
}
