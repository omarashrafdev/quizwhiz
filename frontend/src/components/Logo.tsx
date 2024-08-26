import { useTheme } from "@/components/providers/theme-provider"

export default function Logo() {
    const { theme } = useTheme();

    return (
        <img
            src={theme === "dark" ? "/logo-light.png" : "/logo-dark.png"}
            alt="QuizWhiz Logo"
            className="w-16"
        />
    );
}
