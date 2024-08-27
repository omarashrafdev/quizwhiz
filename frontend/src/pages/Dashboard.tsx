import { useAuth } from "@/components/providers/AuthProvider";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";

export default function Dashboard() {
    const { token } = useAuth();
    const [quizzes, setQuizzes] = useState({
        created: [

        ], participated: []
    });

    const getQuizzes = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_KEY}/user/quizzes/`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setQuizzes(data);
        } catch (error) {
            console.error("Error fetching quizzes:", error);
        }
    };

    useEffect(() => {
        getQuizzes();
    }, []);

    return (
        <div className="w-full my-10">
            <div>
                {/* <h1 className="text-4xl font-bold mb-6">Dashboard</h1> */}
                <div>
                    <h2 className="text-2xl font-bold mb-2">Created Quizzes</h2>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Number of questions</TableHead>
                                <TableHead>Submissions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {quizzes.created.length === 0 ? (
                                <TableRow>
                                    <TableCell className="text-center" colSpan={3}>You haven't created a quiz yet.</TableCell>
                                </TableRow>
                            ) :
                                (
                                    quizzes.created.map((quiz, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{quiz.title}</TableCell>
                                            <TableCell>{quiz.questions.length}</TableCell>
                                            <TableCell>0</TableCell>
                                        </TableRow>
                                    ))
                                )}
                        </TableBody>
                    </Table>
                </div>
                <br />
                <div>
                    <h2 className="text-2xl font-bold mb-2">Quizzes Taken</h2>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Number of questions</TableHead>
                                <TableHead>Score</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {quizzes.participated.length === 0 ? (
                                <TableRow>
                                    <TableCell className="text-center" colSpan={3}>You haven't took any quiz yet.</TableCell>
                                </TableRow>
                            ) :
                                (quizzes.participated.map((submission, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{submission.quiz.title}</TableCell>
                                        <TableCell>{submission.quiz.questions.length}</TableCell>
                                        <TableCell>{submission.quiz.score}</TableCell>
                                    </TableRow>
                                )))
                            }
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
