import { useAuth } from "@/components/providers/AuthProvider";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Pencil, Trash } from "lucide-react";

type Quiz = {
    id: string;
    title: string;
    description: string;
    password: string;
    creator: number;
    start_time: Date | null;
    duration: string;
    questions: Question[];
};

type Question = {
    id: string;
    content: string;
    correct_choice: string | null;
    choices: Choice[];
};

type Choice = {
    id: string;
    content: string;
};

export default function Quiz() {
    const { id } = useParams<{ id: string }>();
    const { token } = useAuth();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [hidden, setHidden] = useState(true);

    const getQuizDetails = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_KEY}/quiz/${id}/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const data: Quiz = await response.json();
                setQuiz(data);
            } else {
                console.error("Failed to fetch quiz details.");
            }
        } catch (error) {
            console.error("Error fetching quiz details:", error);
        }
    };

    const handleDeleteQuiz = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_KEY}/quiz/${id}/`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                alert("Quiz deleted successfully!");
                navigate("/dashboard"); // Navigate back to the quiz list page
            } else {
                console.error("Failed to delete quiz.");
            }
        } catch (error) {
            console.error("Error deleting quiz:", error);
        }
    };

    const handleEditQuiz = async () => {
        navigate(`/dashboard/quiz/${id}/edit`); // Redirect to the edit quiz page
    };

    useEffect(() => {
        getQuizDetails();
    }, [id]);

    const handleShowPassword = () => {
        setHidden(!hidden);
    };

    if (!quiz) {
        return <div>Loading...</div>;
    }

    return (
        <div className="w-full my-10">
            <div className="flex flex-row justify-between">
                <h2 className="text-3xl font-bold mb-2">{quiz.title}</h2>
                <div>
                    <Button onClick={handleEditQuiz} className="mr-2">
                        <Pencil className="mr-1" /> Edit Quiz
                    </Button>
                    <Button variant="destructive" onClick={handleDeleteQuiz}>
                        <Trash className="mr-1" /> Delete Quiz
                    </Button>
                </div>
            </div>
            {quiz.description && (
                <p>
                    <b>Description:</b> {quiz.description}
                </p>
            )}
            <p>
                <b>Duration:</b> {quiz.duration || "No specific duration set."}
            </p>
            <p>
                <b>Start Time:</b>{" "}
                {quiz.start_time ? new Date(quiz.start_time).toLocaleString() : "No specific time set."}
            </p>
            {quiz?.password && (
                <div className="flex flex-row">
                    <p>
                        <b className="mr-1">Password:</b>
                        <span>
                            {hidden
                                ? "•".repeat(quiz?.password.length || 0)
                                : quiz?.password}
                        </span>
                    </p>
                    <div className="ml-1">
                        {hidden ? (
                            <Eye onClick={handleShowPassword} />
                        ) : (
                            <EyeOff onClick={handleShowPassword} />
                        )}
                    </div>
                </div>
            )}

            <h3 className="text-2xl mt-5 mb-2">Questions</h3>
            {quiz.questions.map((question, index) => (
                <Card key={question.id} className="mb-4">
                    <CardHeader>
                        <h4 className="text-xl">Question {index + 1}</h4>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-2">{question.content}</p>
                        <h5 className="font-bold">Choices:</h5>
                        <ul>
                            {question.choices.map((choice) => (
                                <li key={choice.id} className={`mb-1 ${choice.id === question.correct_choice ? "text-green-600 font-bold" : ""}`}>
                                    {choice.content}
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
