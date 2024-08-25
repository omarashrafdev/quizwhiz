import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[85dvh] text-gray-50 p-4">
            <div className="max-w-md w-full space-y-6 text-center">
                <img
                    src="/404.png"
                    width={900}
                    height={767}
                    alt="404 Illustration"
                    className="mx-auto"
                />
                <div className="space-y-2">
                    <h1 className="text-gray-950 dark:text-gray-100 text-4xl font-bold">Oops! Page not found.</h1>
                    <p className="text-gray-400">The page you're looking for doesn't exist or has been moved.</p>
                </div>
                <Button
                >
                    <Link to="/">Go back home</Link>
                </Button>
            </div>
        </div>
    )
}