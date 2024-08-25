import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";

import { Alert, AlertTitle } from "@/components/ui/alert";

const formSchema = z.object({
    name: z.string().min(2, "Full name must be at least 6 characters."),
    email: z.string().email("Invalid email address."),
    username: z.string().min(4, "Username must be at least 4 characters."),
    password1: z.string().min(6, "Password must be at least 6 characters."),
    password2: z.string().min(6, "Password must be at least 6 characters."),
}).superRefine(({ password2, password1 }, ctx) => {
    if (password2 !== password1) {
        ctx.addIssue({
            code: "custom",
            message: "The passwords did not match",
            path: ['password2']
        });
    }
});

export default function Register() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [registerErr, setRegisterErr] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(formSchema),
    });

    const onSubmit = async (data: { name: string; email: string; username: string; password1: string }) => {
        setLoading(true);
        setRegisterErr(null);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_KEY}/register/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=UTF-8",
                },
                body: JSON.stringify({
                    name: data.name,
                    email: data.email,
                    username: data.username,
                    password: data.password1,
                }),
            });

            const result = await response.json();

            if (result.email) {
                setError("email", { type: "manual", message: result.email });
            }
            if (result.username) {
                setError("username", { type: "manual", message: result.username });
            }

            if (result.id) {
                setLoading(false);
                setRegisterErr(null);
                // TODO: show pop up message (alert box) and wait 5s and redirect to login
                navigate("/login");
            } else {
                setLoading(false);
            }
        } catch (err) {
            setRegisterErr("An unexpected error occurred. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[85dvh] w-full my-4">
            <Card className="xl:w-6/12 md:w-10/12 sm:w-11/12 p-5">
                <CardHeader>
                    <span className="text-3xl">Login to QuizWhiz</span>
                </CardHeader>
                <CardContent>
                    {registerErr && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>{registerErr}</AlertTitle>
                        </Alert>
                    )}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="Your full name"
                                {...register("name")}
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm pt-1">{errors.name.message}</p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="Your username"
                                {...register("username")}
                            />
                            {errors.username && (
                                <p className="text-red-500 text-sm pt-1">{errors.username.message}</p>
                            )}
                        </div>
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
                            <Label htmlFor="password1">Password</Label>
                            <Input
                                id="password1"
                                type="password"
                                placeholder="Your password"
                                {...register("password1")}
                            />
                            {errors.password1 && (
                                <p className="text-red-500 text-sm pt-1">{errors.password1.message}</p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="password2">Confirm Password</Label>
                            <Input
                                id="password2"
                                type="password"
                                placeholder="Your password"
                                {...register("password2")}
                            />
                            {errors.password2 && (
                                <p className="text-red-500 text-sm pt-1">{errors.password2.message}</p>
                            )}
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Loading..." : "Register"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-row justify-between text-gray-500">
                    <Link className="hover:underline" to="/login">
                        Already have an account
                    </Link>

                    <Link className="hover:underline" to="/help">
                        Need help?
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
