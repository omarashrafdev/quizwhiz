import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TimePickerDemo } from "@/components/time-picker-demo"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
} from "@/components/ui/form";
import {
    Alert,
    AlertTitle,
} from "@/components/ui/alert"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { AlertCircle, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useNavigate } from "react-router-dom";

// Validation schema using zod
const quizSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    password: z.string().optional(),
    startTime: z.date().optional(),
    duration: z.number().optional(),
});

type QuizFormType = z.infer<typeof quizSchema>;

export default function AddQuiz() {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [formError, setFormError] = useState<string | null>(null);


    // React Hook Form setup
    const form = useForm<QuizFormType>({
        resolver: zodResolver(quizSchema),
    });

    const onSubmit = async (data: QuizFormType) => {
        const quizData = {
            ...data,
            duration: data.duration ? Number(data.duration) : null,
        };
        setLoading(true);
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_KEY}/quiz/create/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8",
                        "Authorization": `Bearer ${token}`,
                    },
                    body: JSON.stringify(quizData),
                }
            );
            if (response.status === 201) {
                const result = await response.json();
                console.log(result);
                navigate("/dashboard");
            } else {
                const result = await response.json();
                console.log(result);
                setFormError(result.message || "An error occurred");
            }
        } catch (err) {
            setFormError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center w-full my-10">
            <Card className="xl:w-10/12 md:w-10/12 sm:w-11/12 p-5">
                <CardHeader>
                    <span className="text-3xl">Add new quiz</span>
                </CardHeader>
                <CardContent>
                    {formError &&
                        <Alert variant="destructive" className="mb-4">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>{formError}</AlertTitle>
                        </Alert>
                    }
                    <Form {...form}>
                        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                            <div>
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    type="text"
                                    placeholder="Title"
                                    {...form.register("title")}
                                    className="mt-1"
                                />
                                {form.formState.errors.title && (
                                    <p className="text-red-600 pt-1">
                                        {form.formState.errors.title.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="description">Description</Label>
                                <Input
                                    id="description"
                                    type="text"
                                    placeholder="Description (Optional)"
                                    {...form.register("description")}
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="text"
                                    placeholder="Password (Optional)"
                                    {...form.register("password")}
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <Label htmlFor="startTime">Start Time</Label>
                                <FormField
                                    control={form.control}
                                    name="startTime"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col mt-1">
                                            <Popover>
                                                <FormControl>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            className={cn(
                                                                "w-[280px] justify-start text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                            {field.value ? (
                                                                format(field.value, "PPP HH:mm:ss")
                                                            ) : (
                                                                <span>Pick a date</span>
                                                            )}
                                                        </Button>
                                                    </PopoverTrigger>
                                                </FormControl>
                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        initialFocus
                                                    />
                                                    <div className="p-3 border-t border-border">
                                                        <TimePickerDemo
                                                            setDate={field.onChange}
                                                            date={field.value}
                                                        />
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div>
                                <Label htmlFor="duration">Duration in minutes</Label>
                                <Input
                                    id="duration"
                                    type="number"
                                    min="1"
                                    max="180"
                                    placeholder="Duration (Optional)"
                                    {...form.register("duration", {
                                        valueAsNumber: true,
                                    })}
                                    className="mt-1"
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Loading..." : "Add"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
