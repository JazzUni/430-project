"use client";
import { useEffect } from "react";

export default function ActivityTracker() {
    useEffect(() => {

        let timeout: ReturnType<typeof setTimeout> | null = null;

        const update = () => {
            if (timeout) {
                clearTimeout(timeout);
            }

            timeout = setTimeout(() => {
                fetch("/api/refresh-session").catch(() => {});
            }, 3000);
            
        };

        window.addEventListener("click", update);
        window.addEventListener("keydown", update);
        window.addEventListener("mousemove", update);
        window.addEventListener("scroll", update);

        return () => {

            if (timeout) {
                clearTimeout(timeout);
            }
            window.removeEventListener("click", update);
            window.removeEventListener("keydown", update);
            window.removeEventListener("mousemove", update);
            window.removeEventListener("scroll", update);
        };
    }, []);

    return null;
}