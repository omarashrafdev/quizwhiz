import { useAuth } from "@/components/providers/AuthProvider";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Pencil, Trash } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

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
                navigate("/dashboard");
            } else {
                console.error("Failed to delete quiz.");
            }
        } catch (error) {
            console.error("Error deleting quiz:", error);
        }
    };

    const handleEditQuiz = () => {
        navigate(`/dashboard/quiz/${id}/edit`);
    };

    useEffect(() => {
        getQuizDetails();
    }, [id]);

    const handleShowPassword = () => {
        setHidden(!hidden);
    };

    if (!quiz) {
        return <div className="text-center text-lg">Loading...</div>;
    }

    return (
        <div className="w-full my-10 px-4">
            <div className="flex flex-row justify-between">
                <h2 className="text-3xl font-bold mb-2 dark:text-white">{quiz.title}</h2>
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
                <p className="text-gray-700 dark:text-gray-300">
                    <b>Description:</b> {quiz.description}
                </p>
            )}
            <p className="text-gray-700 dark:text-gray-300">
                <b>Duration:</b>{" "}
                {quiz.duration
                    ? `${quiz.duration.split(":")[0] === "00" ? "" : `${Number(quiz.duration.split(":")[0])}H `}${quiz.duration.split(":")[1] === "00" ? "" : `${Number(quiz.duration.split(":")[1])}M`}`
                    : "No specific duration set."}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
                <b>Start Time:</b>{" "}
                {quiz.start_time ? new Date(quiz.start_time).toLocaleString() : "No specific time set."}
            </p>
            {quiz?.password && (
                <div className="flex flex-row text-gray-700 dark:text-gray-300">
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
                            <Eye onClick={handleShowPassword} className="cursor-pointer dark:text-white" />
                        ) : (
                            <EyeOff onClick={handleShowPassword} className="cursor-pointer dark:text-white" />
                        )}
                    </div>
                </div>
            )}

            <h3 className="text-3xl mt-5 mb-2 dark:text-white">Questions</h3>
            {quiz.questions.map((question, index) => (
                <Card key={question.id} className="mb-4 bg-gray-50 dark:bg-gray-800">
                    <CardHeader>
                        <h4 className="text-xl dark:text-white">Question {index + 1}</h4>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-2 text-lg font-bold dark:text-gray-300">{question.content}</p>
                        <RadioGroup
                            className="checked:text-green-700"
                            defaultValue={question.correct_choice ? question.correct_choice : undefined}
                        >
                            {question.choices.map((choice) => (
                                <Card
                                    key={choice.id}
                                    className={`px-6 py-3 ${choice.id === question.correct_choice
                                        ? "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300"
                                        : "bg-white dark:bg-gray-700 text-black dark:text-gray-300"
                                        }`}
                                >
                                    <div className="flex flex-row items-center">
                                        <RadioGroupItem
                                            disabled
                                            value={choice.id}
                                            id={choice.id}
                                            className="dark:border-gray-600"
                                        />
                                        <Label
                                            className="ml-2 dark:text-gray-300"
                                            htmlFor={choice.id}
                                        >
                                            {choice.content}
                                        </Label>
                                    </div>
                                </Card>
                            ))}
                        </RadioGroup>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
