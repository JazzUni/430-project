"use client";
import { useEffect } from "react";

export default function ActivityTracker() {
    useEffect(() => {

        let timeout: any;

        const update = () => {
            clearTimeout(timeout);

            timeout = setTimeout(() => {
                fetch("/api/refresh-session");
            }, 1000);
            
        };

        window.addEventListener("click", update);
        window.addEventListener("keydown", update);
        window.addEventListener("mousemove", update);
        window.addEventListener("scroll", update);

        return () => {
            window.removeEventListener("click", update);
            window.removeEventListener("keydown", update);
            window.removeEventListener("mousemove", update);
            window.removeEventListener("scroll", update);
        };
    }, []);

    return null;
}