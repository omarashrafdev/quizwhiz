import { useAuth } from "@/components/providers/AuthProvider";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from "uuid";
import { SquareX, Eye, EyeOff } from "lucide-react";

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
    type: string;
    correct_choice: number | null;
    correct_choice_index: number | null; // Add this to store the index
    choices: Choice[];
};

type Choice = {
    id: string;
    content: string;
};

export default function AddQuestions() {
    const { id } = useParams();
    const { token } = useAuth();
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [newQuestions, setNewQuestions] = useState<Question[]>([]);
    const [hidden, setHidden] = useState(true);

    const getQuizDetails = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_KEY}/quiz/${id}/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data: Quiz = await response.json();
            setQuiz(data);
        } catch (error) {
            console.error("Error fetching quiz details:", error);
        }
    };

    useEffect(() => {
        getQuizDetails();
    }, []);

    const handleAddQuestion = () => {
        const newQuestion: Question = {
            id: uuidv4(),
            content: "",
            type: "mcq",
            correct_choice: null,
            correct_choice_index: null, // Initialize with null
            choices: [{ id: uuidv4(), content: "" }],
        };
        setNewQuestions([...newQuestions, newQuestion]);
    };

    const handleAddChoice = (questionId: string) => {
        setNewQuestions(
            newQuestions.map((q) =>
                q.id === questionId
                    ? { ...q, choices: [...q.choices, { id: uuidv4(), content: "" }] }
                    : q
            )
        );
    };

    const handleQuestionChange = (questionId: string, content: string) => {
        setNewQuestions(
            newQuestions.map((q) =>
                q.id === questionId ? { ...q, content } : q
            )
        );
    };

    const handleChoiceChange = (questionId: string, choiceId: string, content: string) => {
        setNewQuestions(
            newQuestions.map((q) =>
                q.id === questionId
                    ? {
                        ...q,
                        choices: q.choices.map((c) =>
                            c.id === choiceId ? { ...c, content } : c
                        ),
                    }
                    : q
            )
        );
    };

    const handleCorrectChoiceChange = (questionId: string, choiceIndex: number) => {
        setNewQuestions(
            newQuestions.map((q) =>
                q.id === questionId ? { ...q, correct_choice_index: choiceIndex } : q
            )
        );
    };

    const handleSave = async () => {
        try {
            for (let question of newQuestions) {
                // Post the question without the correct choice initially
                const questionResponse = await fetch(`${import.meta.env.VITE_API_KEY}/quiz/${id}/question/`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        content: question.content,
                        type: question.type,
                        correct_choice: null, // Initially set to null
                    }),
                });

                if (!questionResponse.ok) {
                    throw new Error(`Failed to save question: ${question.content}`);
                }

                const savedQuestion = await questionResponse.json();
                const questionId = savedQuestion.id;

                // Post each choice and track IDs
                let choiceIds: string[] = [];
                for (let choice of question.choices) {
                    const choiceResponse = await fetch(`${import.meta.env.VITE_API_KEY}/question/${questionId}/choice/`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            content: choice.content,
                        }),
                    });

                    if (!choiceResponse.ok) {
                        throw new Error(`Failed to save choice: ${choice.content}`);
                    }

                    const savedChoice = await choiceResponse.json();
                    choiceIds.push(savedChoice.id);
                }

                // Update the question with the correct choice ID
                const correctChoiceId = choiceIds[question.correct_choice_index || 0];
                await fetch(`${import.meta.env.VITE_API_KEY}/quiz/${id}/question/${questionId}/`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        correct_choice: correctChoiceId,
                    }),
                });
            }

            alert("Questions and choices saved successfully!");
        } catch (error) {
            console.error("Error saving questions:", error);
            alert("An error occurred while saving the questions.");
        }
    };

    const handleShowPassword = () => {
        setHidden(!hidden);
    };

    const handleQuestionDeletion = (questionId: string) => {
        setNewQuestions(newQuestions.filter((q) => q.id !== questionId));
    };

    const handleChoiceDeletion = (questionId: string, choiceId: string) => {
        setNewQuestions(
            newQuestions.map((q) =>
                q.id === questionId
                    ? {
                        ...q,
                        choices: q.choices.filter((c) => c.id !== choiceId),
                    }
                    : q
            )
        );
    };

    return (
        <div className="w-full my-10">
            <div className="flex flex-row justify-between">
                <h2 className="text-3xl font-bold mb-2">Add Questions</h2>
            </div>
            <div className="mb-4">
                <p>
                    <b>Title:</b> {quiz?.title}
                </p>
                <p>
                    <b>Description:</b> {quiz?.description}
                </p>
                <p>
                    <b>Duration:</b>{" "}
                    <span>
                        {quiz?.duration
                            ? quiz.duration.toString()
                            : "No specific duration set."}
                    </span>
                </p>
                <p>
                    <b className="mr-1">Start Time:</b>
                    <span>
                        {quiz?.start_time
                            ? new Date(quiz.start_time).toLocaleString()
                            : "No specific time set."}
                    </span>
                </p>
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
            </div>

            {newQuestions.map((question, index) => (
                <Card key={question.id} className="my-4">
                    <CardHeader>
                        <div className="flex flex-row align-center justify-between">
                            <p className="text-xl">Question {index + 1}</p>
                            <SquareX className="my-auto" onClick={() => handleQuestionDeletion(question.id)} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Input
                            placeholder="Question content"
                            value={question.content}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                handleQuestionChange(question.id, e.target.value)
                            }
                            className="mb-2"
                        />
                        <RadioGroup
                            defaultValue={"0"}
                            onValueChange={(choiceIndex: string) => handleCorrectChoiceChange(question.id, parseInt(choiceIndex))}
                        >
                            {question.choices.map((choice, idx) => (
                                <div key={choice.id} className="flex flex-row align-center justify-between mb-2">
                                    <RadioGroupItem
                                        className="my-auto mr-4"
                                        value={idx.toString()} // Use index as value
                                        id={choice.id}
                                    />
                                    <Input
                                        placeholder="Choice content"
                                        value={choice.content}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                            handleChoiceChange(question.id, choice.id, e.target.value)
                                        }
                                    />
                                    <SquareX
                                        className="my-auto ml-4"
                                        onClick={() => handleChoiceDeletion(question.id, choice.id)}
                                    />
                                </div>
                            ))}
                        </RadioGroup>
                        <Button onClick={() => handleAddChoice(question.id)} className="w-full mt-2">
                            Add Choice
                        </Button>
                    </CardContent>
                </Card>
            ))}

            <div className="flex flex-row justify-between">
                <Button onClick={handleAddQuestion}>Add Question</Button>
                <Button onClick={handleSave}>Save Questions</Button>
            </div>
        </div>
    );
}
