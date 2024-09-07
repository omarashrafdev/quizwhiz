import { cn } from "@/lib/utils";
import { Link, useNavigate } from "react-router-dom";
import { ModeToggle } from "./theme-toggle";
import { Button } from "./ui/button";
import { useAuth } from "./providers/AuthProvider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Logo from "./Logo";

export function Nav({
    className,
    ...props
}: React.HTMLAttributes<HTMLElement>) {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav
            className={cn(
                "w-full px-8 py-4 flex items-center justify-between space-x-4 lg:space-x-6 border-b ",
                className
            )}
            {...props}
        >
            <div className="flex items-center space-x-5">
                <Logo />
                <Link
                    to="/"
                    className="text-sm font-medium transition-colors hover:text-primary"
                >
                    Home
                </Link>
                <Link
                    to="/about"
                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                    About
                </Link>
                {(user) && (
                    <Link
                        to="/dashboard"
                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                    >
                        Dashboard
                    </Link>
                )}
            </div>
            <div className="flex items-center space-x-4">
                {(user) ? (
                    <Avatar>
                        <AvatarFallback>
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    {user.name[0]}
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>Profile</DropdownMenuItem>
                                    <DropdownMenuItem>Settings</DropdownMenuItem>
                                    <DropdownMenuItem onClick={handleLogout}>
                                        Logout
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </AvatarFallback>
                    </Avatar>
                ) : (
                    <Button size={"sm"} asChild>
                        <Link to="/login">login</Link>
                    </Button>
                )}
                <ModeToggle />
            </div>
        </nav>
    );
}
