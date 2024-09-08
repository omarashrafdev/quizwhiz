import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash, GripVertical } from "lucide-react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { SortableItem } from "@/components/SortableItem"
import { Label } from "@/components/ui/label";
import { useAuth } from "@/components/providers/AuthProvider";

type Choice = {
    id: string | null;
    content: string;
};

export default function EditQuestion() {
    const { token } = useAuth();
    const navigate = useNavigate();
    const { id, questionId } = useParams<{ id: string, questionId: string }>();
    const [choices, setChoices] = useState<Choice[]>([]);
    const [questionContent, setQuestionContent] = useState<string>("");
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

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
            } else {
                console.error("Failed to fetch question details.");
            }
        } catch (error) {
            console.error("Error fetching question details:", error);
        }
    };

    const handleAddChoice = () => {
        setChoices([...choices, { id: null, content: "" }]);
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
                });
                if (response.ok) {
                    const updatedChoices = choices.filter((_, i) => i !== index);
                    setChoices(updatedChoices);
                }
            } catch (error) {
                console.error("Error deleting choice:", error);
            }
        } else {
            const updatedChoices = choices.filter((_, i) => i !== index);
            setChoices(updatedChoices);
        }
    };

    const handleSaveChoice = async (index: number) => {
        const choice = choices[index];
        if (choice.id) {
            // Update existing choice
            try {
                await fetch(`${import.meta.env.VITE_API_KEY}/question/${questionId}/choice/${choice.id}/`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ content: choice.content }),
                });
            } catch (error) {
                console.error("Error updating choice:", error);
            }
        } else {
            // Create new choice
            try {
                const response = await fetch(`${import.meta.env.VITE_API_KEY}/question/${questionId}/choice/`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ content: choice.content }),
                });
                const newChoice = await response.json();
                const updatedChoices = [...choices];
                updatedChoices[index].id = newChoice.id;
                setChoices(updatedChoices);
            } catch (error) {
                console.error("Error creating choice:", error);
            }
        }
    };

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            setChoices((items) => {
                const oldIndex = items.findIndex(item => item.id === active.id);
                const newIndex = items.findIndex(item => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
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

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={choices.map(choice => choice.id || "")} strategy={verticalListSortingStrategy}>
                    {choices.map((choice, index) => (
                        <SortableItem key={choice.id || index} id={choice.id || index}>
                            <div className="flex items-center mb-2">
                                <Button size="icon" variant="ghost" className="cursor-grab">
                                    <GripVertical />
                                </Button>
                                <Input
                                    value={choice.content}
                                    onChange={(e) => handleChoiceChange(index, e.target.value)}
                                    className="ml-2 flex-grow"
                                />
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="ml-2"
                                    onClick={() => handleDeleteChoice(choice.id, index)}
                                >
                                    <Trash />
                                </Button>
                                <Button
                                    className="ml-2"
                                    onClick={() => handleSaveChoice(index)}
                                >
                                    Save
                                </Button>
                            </div>
                        </SortableItem>
                    ))}
                </SortableContext>
            </DndContext>

            <Button onClick={handleAddChoice} className="mt-4">
                Add Choice
            </Button>
        </div>
    );
}
