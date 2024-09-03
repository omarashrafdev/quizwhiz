import { useAuth } from "@/components/providers/AuthProvider";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function EditQuiz() {
    const { id } = useParams<{ id: string }>();
    const { token } = useAuth();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState({
        title: "",
        description: "",
        duration: "",
        start_time: "",
        password: "",
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
                const [hours, minutes, seconds] = data.duration.split(':').map(Number);
                const totalMinutes = (hours * 60) + minutes + (seconds / 60);
                setQuiz({
                    title: data.title,
                    description: data.description,
                    duration: totalMinutes,
                    start_time: data.start_time,
                    password: data.password,
                });
            } else {
                console.error("Failed to fetch quiz details.");
            }
        } catch (error) {
            console.error("Error fetching quiz details:", error);
        }
    };

    const handleEditQuiz = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_KEY}/quiz/${id}/`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: quiz.title,
                    description: quiz.description,
                    duration: Number(quiz.duration) * 60,
                    start_time: quiz.start_time,
                    password: quiz.password,
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
            <div className="mb-4">
                <Label>Title</Label>
                <Input
                    value={quiz.title}
                    onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
                />
            </div>
            <div className="mb-4">
                <Label>Description</Label>
                <Input
                    value={quiz.description}
                    onChange={(e) => setQuiz({ ...quiz, description: e.target.value })}
                />
            </div>
            <div className="mb-4">
                <Label>Duration</Label>
                <Input
                    value={quiz.duration}
                    onChange={(e) => setQuiz({ ...quiz, duration: e.target.value })}
                />
            </div>
            <div className="mb-4">
                <Label>Start Time</Label>
                <Input
                    type="datetime-local"
                    value={quiz.start_time}
                    onChange={(e) => setQuiz({ ...quiz, start_time: e.target.value })}
                />
            </div>
            <div className="mb-4">
                <Label>Password</Label>
                <Input
                    value={quiz.password}
                    onChange={(e) => setQuiz({ ...quiz, password: e.target.value })}
                />
            </div>
            <Button onClick={handleEditQuiz}>Save Changes</Button>
        </div>
    );
}
