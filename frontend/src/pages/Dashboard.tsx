import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

type Quiz = {
    id: string;
    title: string;
    questions: { length: number }[];
};

type QuizSubmission = {
    quiz: Quiz;
    score: number;
};

type QuizzesState = {
    created: Quiz[];
    participated: QuizSubmission[];
};


export default function Dashboard() {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [quizzes, setQuizzes] = useState<QuizzesState>({
        created: [],
        participated: [],
    });

    const getQuizzes = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_KEY}/user/quizzes/`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });
            const data: QuizzesState = await response.json();
            setQuizzes(data);
        } catch (error) {
            console.error("Error fetching quizzes:", error);
        }
    };

    useEffect(() => {
        getQuizzes();
    }, []);

    const addQuiz = () => {
        navigate("/dashboard/add-quiz")
    }

    return (
        <div className="w-full my-10">
            <div>
                <div className="flex flex-row justify-between">
                    <h2 className="text-2xl font-bold mb-2">Created Quizzes - {quizzes.created?.length}</h2>
                    <Button onClick={addQuiz}>Add quiz</Button>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Number of questions</TableHead>
                            <TableHead>Submissions</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {quizzes.created?.length === 0 ? (
                            <TableRow>
                                <TableCell className="text-center" colSpan={3}>You haven't created a quiz yet.</TableCell>
                            </TableRow>
                        ) :
                            (
                                quizzes.created?.map((quiz, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{quiz.title}</TableCell>
                                        <TableCell>{quiz.questions.length}</TableCell>
                                        <TableCell>0</TableCell>
                                        <TableCell>
                                            <Link
                                                to={"/dashboard/quiz/" + quiz.id}
                                                className="underline"
                                            >
                                                View
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                    </TableBody>
                </Table>
            </div>
            <br />
            <div>
                <h2 className="text-2xl font-bold mb-2">Quizzes Taken - {quizzes.participated?.length}</h2>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Number of questions</TableHead>
                            <TableHead>Score</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {quizzes.participated?.length === 0 ? (
                            <TableRow>
                                <TableCell className="text-center" colSpan={3}>You haven't took any quiz yet.</TableCell>
                            </TableRow>
                        ) :
                            (quizzes.participated?.map((submission, index) => (
                                <TableRow key={index}>
                                    <TableCell>{submission.quiz.title}</TableCell>
                                    <TableCell>{submission.quiz.questions.length}</TableCell>
                                    <TableCell>{submission.score}</TableCell>
                                </TableRow>
                            )))
                        }
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
