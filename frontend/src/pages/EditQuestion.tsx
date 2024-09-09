import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/components/providers/AuthProvider";
import { Label } from "@/components/ui/label";

type Choice = {
    id: string;
    content: string;
};

export default function EditQuestion() {
    const { token } = useAuth();
    const navigate = useNavigate();
    const { id, questionId } = useParams<{ id: string, questionId: string }>();
    const [choices, setChoices] = useState<Choice[]>([]);
    const [questionContent, setQuestionContent] = useState<string>("");
    const [correctChoiceIndex, setCorrectChoiceIndex] = useState<string>("");

    useEffect(() => {
        getQuestionDetails();
    }, [questionId]);

    const getQuestionDetails = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_KEY}/quiz/${id}/question/${questionId}/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setQuestionContent(data.content);
                setChoices(data.choices);
                const correctChoiceIndex = data.choices.findIndex((choice: { id: any; }) => choice.id === data.correct_choice);
                setCorrectChoiceIndex(correctChoiceIndex !== -1 ? correctChoiceIndex.toString() : "");

            } else {
                console.error("Failed to fetch question details.");
            }
        } catch (error) {
            console.error("Error fetching question details:", error);
        }
    };

    const handleAddChoice = () => {
        setChoices([...choices, { id: "", content: "" }]);
    };



    const handleChoiceChange = (index: number, content: string) => {
        const updatedChoices = [...choices];
        updatedChoices[index].content = content;
        setChoices(updatedChoices);
    };

    const handleDeleteChoice = async (choiceId: string | null, index: number) => {
        if (choiceId) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_KEY}/question/${questionId}/choice/${choiceId}/`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                if (response.ok) {
                    const updatedChoices = choices.filter((_, i) => i !== index);
                    setChoices(updatedChoices);

                    // Recalculate correctChoiceIndex
                    if (correctChoiceIndex === index.toString()) {
                        const newCorrectChoice = updatedChoices.find((_, i) => i === parseInt(correctChoiceIndex));
                        setCorrectChoiceIndex(newCorrectChoice ? newCorrectChoice.id : "");
                    } else if (parseInt(correctChoiceIndex) > index) {
                        setCorrectChoiceIndex((parseInt(correctChoiceIndex) - 1).toString());
                    }
                }
            } catch (error) {
                console.error("Error deleting choice:", error);
            }
        } else {
            const updatedChoices = choices.filter((_, i) => i !== index);
            setChoices(updatedChoices);

            // Recalculate correctChoiceIndex
            if (correctChoiceIndex === index.toString()) {
                const newCorrectChoice = updatedChoices.find((_, i) => i === parseInt(correctChoiceIndex));
                setCorrectChoiceIndex(newCorrectChoice ? newCorrectChoice.id : "");
            } else if (parseInt(correctChoiceIndex) > index) {
                setCorrectChoiceIndex((parseInt(correctChoiceIndex) - 1).toString());
            }
        }
    };


    const handleSave = async () => {
        try {
            // Update the question content
            await fetch(`${import.meta.env.VITE_API_KEY}/quiz/${id}/question/${questionId}/`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ content: questionContent }),
            });

            // Save all choices
            for (const [index, choice] of choices.entries()) {
                if (choice.id) {
                    // Update existing choice
                    await fetch(`${import.meta.env.VITE_API_KEY}/question/${questionId}/choice/${choice.id}/`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ content: choice.content }),
                    });
                } else {
                    // Create new choice
                    const response = await fetch(`${import.meta.env.VITE_API_KEY}/question/${questionId}/choice/`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ content: choice.content }),
                    });
                    const newChoice = await response.json();
                    choices[index].id = newChoice.id; // Update the choice with its new ID
                }
            }

            // Update the correct choice
            if (correctChoiceIndex !== "") {
                await fetch(`${import.meta.env.VITE_API_KEY}/quiz/${id}/question/${questionId}/`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ correct_choice: choices[Number(correctChoiceIndex)].id }),
                });
            }

            alert("Question and choices saved successfully!");
            navigate(`/dashboard/quiz/${id}`);
        } catch (error) {
            console.error("Error saving question and choices:", error);
        }
    };

    return (
        <div className="w-full my-10 px-4">
            <h2 className="text-2xl font-bold mb-4">Edit Question</h2>
            <div className="mb-4">
                <Label htmlFor="question-content">Question</Label>
                <Input
                    id="question-content"
                    value={questionContent}
                    onChange={(e) => setQuestionContent(e.target.value)}
                />
            </div>

            <RadioGroup
                value={correctChoiceIndex}  // Make RadioGroup controlled
                onValueChange={(value) => setCorrectChoiceIndex(value)}  // Handle value change
            >
                {choices.map((choice, index) => {
                    return (
                        <div key={index.toString()} className="flex items-center mb-2">
                            <RadioGroupItem
                                className="mx-2"
                                value={index.toString()}  // Ensure value is string
                                id={index.toString()}  // Ensure unique ID for accessibility
                            />
                            <Input
                                value={choice.content}  // Controlled input for content
                                onChange={(e) => handleChoiceChange(index, e.target.value)}  // Handle input change
                                className="ml-2 flex-grow"
                            />
                            <Button
                                variant="destructive"
                                size="icon"
                                className="ml-4"
                                onClick={() => handleDeleteChoice(choice.id, index)}  // Delete handler
                            >
                                <Trash />
                            </Button>
                        </div>
                    )
                })}
            </RadioGroup>

            <div className="flex flex-row justify-between">
                <Button onClick={handleAddChoice} className="mt-4">
                    Add Choice
                </Button>
                <Button onClick={handleSave} className="mt-4">
                    Save Question
                </Button>
            </div>
        </div>
    );
}
