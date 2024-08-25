import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react"
import { jwtDecode } from "jwt-decode";

import {
    Alert,
    AlertTitle,
} from "@/components/ui/alert"
import { useAuth } from "@/components/providers/AuthProvider";
import { User } from "@/lib/types";

const formSchema = z.object({
    email: z.string().email("Invalid email address."),
    password: z.string().min(6, "Password must be at least 6 characters."),
});

export default function Login() {
    const { user, login } = useAuth()

    useEffect(() => {
        console.log("user is", user)
        if (user) {
            return navigate("/")
        }
    }, [user])

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [loginErr, setLoginErr] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(formSchema),
    });

    const onSubmit = async (data: { email: string, password: string }) => {
        setLoading(true);
        await fetch(
            `${import.meta.env.VITE_API_KEY}/login/`,

            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=UTF-8",
                },
                body: JSON.stringify({
                    "email": data.email,
                    "password": data.password
                })
            }
        ).then((res => res.json())).then((data) => {
            if (data.detail) {
                setLoginErr(data.detail)
                setLoading(false);
            }

            if (data.access) {
                setLoading(false);
                setLoginErr(null);
                const decoded: {
                    email: string,
                    exp: number,
                    iat: number,
                    jti: string,
                    name: string,
                    token_type: string,
                    user_id: number,
                    username: string
                } = jwtDecode(data.access);

                let user: User = {
                    id: decoded.user_id,
                    name: decoded.name,
                    email: decoded.email,
                    username: decoded.username
                }
                login({ user: user, token: data.access })
                return navigate("/")
            }
        }).catch((err) => {
            setLoginErr(err)
            setLoading(false);
        })
    };

    return (
        <div className="flex justify-center items-center min-h-[85dvh] w-full">
            <Card className="xl:w-6/12 md:w-10/12 sm:w-11/12 p-5">
                <CardHeader>
                    <span className="text-3xl">Login to QuizWhiz</span>
                </CardHeader>
                <CardContent>
                    {loginErr &&
                        <Alert variant="destructive" className="mb-4">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>{loginErr}</AlertTitle>
                        </Alert>
                    }
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Your email"
                                {...register("email")}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm pt-1">{errors.email.message}</p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Your password"
                                {...register("password")}
                            />
                            {errors.password && (
                                <p className="text-red-500 text-sm pt-1">{errors.password.message}</p>
                            )}
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Loading..." : "Login"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter
                    className="flex flex-row justify-between text-gray-500"
                >
                    <Link
                        className="hover:underline"
                        to="/register"
                    >
                        Create a new account
                    </Link>

                    <Link
                        className="hover:underline"
                        to="/forget-password"
                    >
                        Forget password
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
