import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/components/providers/AuthProvider";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { FormControl, FormField, FormItem, Form } from "@/components/ui/form";
import { TimePickerDemo } from "@/components/time-picker-demo"
import { cn } from "@/lib/utils";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";


const quizSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    password: z.string().optional(),
    start_time: z.date().optional(),
    duration: z.string().optional(),
});

type QuizFormType = z.infer<typeof quizSchema>;

export default function EditQuiz() {
    const { id } = useParams<{ id: string }>();
    const { token } = useAuth();
    const navigate = useNavigate();
    const form = useForm<QuizFormType>({
        resolver: zodResolver(quizSchema),
        defaultValues: {
            title: "",
            description: "",
            duration: "",
            start_time: undefined,
            password: "",
        },
    });

    const getQuizDetails = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_KEY}/quiz/${id}/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                let totalMinutes = null;
                if (data.duration) {
                    const [hours, minutes, seconds] = data.duration.split(':').map(Number);
                    totalMinutes = (hours * 60) + minutes + (seconds / 60);
                }
                // Update form values using form.setValue
                form.setValue("title", data.title);
                form.setValue("description", data.description);
                form.setValue("duration", totalMinutes);
                form.setValue("start_time", data.start_time ? new Date(data.start_time) : undefined);
                form.setValue("password", data.password);
            } else {
                console.error("Failed to fetch quiz details.");
            }
        } catch (error) {
            console.error("Error fetching quiz details:", error);
        }
    };

    const handleEditQuiz = async (data: QuizFormType) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_KEY}/quiz/${id}/`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: data.title,
                    description: data.description,
                    duration: data.duration ? Number(data.duration) * 60 : null,
                    start_time: data.start_time ? data.start_time.toISOString() : null,
                    password: data.password,
                }),
            });

            if (response.ok) {
                alert("Quiz updated successfully!");
                navigate(`/dashboard/quiz/${id}`);
            } else {
                console.error("Failed to update quiz.");
            }
        } catch (error) {
            console.error("Error updating quiz:", error);
        }
    };

    useEffect(() => {
        getQuizDetails();
    }, [id]);

    return (
        <div className="w-full my-10">
            <h2 className="text-3xl font-bold mb-4">Edit Quiz</h2>
            <Form {...form}>
                <form className="space-y-4" onSubmit={form.handleSubmit(handleEditQuiz)}>
                    <div className="mb-4">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            placeholder="Title"
                            className="mt-1"
                            {...form.register("title")}
                        />
                    </div>
                    <div className="mb-4">
                        <Label htmlFor="description">Description</Label>
                        <Input
                            id="description"
                            placeholder="Description (Optional)"
                            className="mt-1"
                            {...form.register("description")}
                        />
                    </div>
                    <div className="mb-4">
                        <Label htmlFor="duration">Duration</Label>
                        <Input
                            id="duration"
                            type="number"
                            min="1"
                            max="180"
                            placeholder="Duration (Optional)"
                            className="mt-1"
                            {...form.register("duration")}
                        />
                    </div>
                    <div>
                        <Label htmlFor="startTime">Start Time</Label>
                        <FormField
                            control={form.control}
                            name="start_time"
                            render={({ field }) => (
                                <FormItem className="flex flex-col mt-1">
                                    <Popover>
                                        <FormControl>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        "w-full justify-start text-left font-normal",
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
                    <div className="mb-4">
                        <Label>Password</Label>
                        <Input
                            id="password"
                            placeholder="Password (Optional)"
                            className="mt-1"
                            {...form.register("password")}
                        />
                    </div>
                    <Button type="submit" className="w-full">Save Changes</Button>
                </form>
            </Form >
        </div >
    );
}
