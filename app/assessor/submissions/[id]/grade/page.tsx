'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';

interface GradingData {
  studentName: string;
  email: string;
  assessmentTitle: string;
  submittedAt: string;
  competency: string;
  answers: Array<{
    questionNumber: number;
    question: string;
    studentAnswer: string;
    maxScore: number;
    scoring: 'auto' | 'manual';
  }>;
}

export default function GradingPage() {
  const [submission] = useState<GradingData>({
    studentName: 'Maria Garcia',
    email: 'maria@example.com',
    assessmentTitle: 'Module 1 Assessment',
    submittedAt: '2024-05-24T10:30:00',
    competency: 'Technical Competency 1',
    answers: [
      {
        questionNumber: 1,
        question: 'What is the fundamental principle of circuit design?',
        studentAnswer: 'The fundamental principle is ensuring current flows properly through all components while maintaining proper voltage levels.',
        maxScore: 10,
        scoring: 'manual',
      },
      {
        questionNumber: 2,
        question: 'Describe the power dissipation in a resistor.',
        studentAnswer: 'Power dissipation is calculated as P = I²R or P = V²/R, representing energy loss as heat in the resistor.',
        maxScore: 10,
        scoring: 'manual',
      },
      {
        questionNumber: 3,
        question: 'What is impedance?',
        studentAnswer: 'Impedance is the total opposition to current flow in an AC circuit, including resistance and reactance.',
        maxScore: 10,
        scoring: 'manual',
      },
    ],
  });

  const [scores, setScores] = useState<Record<number, number>>({});
  const [feedback, setFeedback] = useState('');
  const [saving, setSaving] = useState(false);

  const handleScoreChange = (questionNumber: number, value: string) => {
    const score = parseInt(value) || 0;
    setScores((prev) => ({
      ...prev,
      [questionNumber]: Math.min(score, submission.answers[questionNumber - 1].maxScore),
    }));
  };

  const totalScore = submission.answers.reduce((sum, q) => {
    return sum + (scores[q.questionNumber] || 0);
  }, 0);

  const maxTotalScore = submission.answers.reduce((sum, q) => sum + q.maxScore, 0);
  const percentage = (totalScore / maxTotalScore) * 100;

  const handleSubmitGrade = async () => {
    setSaving(true);
    try {
      // API call would go here
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert('Grade submitted successfully!');
    } catch {
      alert('Error submitting grade');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link to="/assessor/submissions">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Submissions
            </Button>
          </Link>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Grade Submission
              </h1>
              <p className="text-muted-foreground mt-1">
                {submission.assessmentTitle}
              </p>
            </div>
          </div>
        </div>

        {/* Student Info Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Student Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  Student Name
                </div>
                <div className="font-medium">{submission.studentName}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  Email
                </div>
                <div className="font-medium text-sm">{submission.email}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  Competency
                </div>
                <div className="font-medium">{submission.competency}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  Submitted
                </div>
                <div className="font-medium">
                  {new Date(submission.submittedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Score Summary Card */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg">Score Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Overall Score</span>
                  <span className="text-2xl font-bold">
                    {totalScore}/{maxTotalScore}
                  </span>
                </div>
                <Progress value={percentage} className="h-3" />
                <div className="text-sm text-muted-foreground mt-2">
                  {percentage.toFixed(1)}% Complete
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Questions and Scoring */}
        <div className="space-y-6 mb-8">
          {submission.answers.map((answer) => (
            <Card key={answer.questionNumber}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base">
                      Question {answer.questionNumber}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {answer.question}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="ml-4">
                    {answer.maxScore} pts
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Student Answer */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground block mb-2">
                    Student Answer
                  </label>
                  <div className="bg-muted p-4 rounded-lg border border-muted text-sm">
                    {answer.studentAnswer}
                  </div>
                </div>

                {/* Scoring Input */}
                <div className="flex items-end gap-4">
                  <div className="flex-1">
                    <label htmlFor={`score-${answer.questionNumber}`} className="text-sm font-medium block mb-2">
                      Score
                    </label>
                    <Input
                      id={`score-${answer.questionNumber}`}
                      type="number"
                      min="0"
                      max={answer.maxScore}
                      placeholder="0"
                      value={scores[answer.questionNumber] ?? ''}
                      onChange={(e) =>
                        handleScoreChange(answer.questionNumber, e.target.value)
                      }
                    />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    / {answer.maxScore}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Feedback Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Feedback to Student</CardTitle>
            <CardDescription>
              Provide constructive feedback for this submission
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Enter your feedback here... This will be shared with the student."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="min-h-32"
            />
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end">
          <Link to="/assessor/submissions">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button
            onClick={handleSubmitGrade}
            disabled={saving || totalScore === 0}
            className="gap-2"
          >
            {saving ? (
              <>Submitting...</>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Submit Grade
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
