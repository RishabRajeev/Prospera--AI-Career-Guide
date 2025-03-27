"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, RefreshCw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface InterviewPrep {
  common_questions: {
    question: string;
    tips: string[];
    sample_answer: string;
  }[];
  technical_questions: {
    question: string;
    difficulty: string;
    explanation: string;
    sample_answer: string;
  }[];
  behavioral_questions: {
    question: string;
    what_they_look_for: string[];
    sample_answer: string;
  }[];
  interview_tips: string[];
  preparation_checklist: string[];
}

export default function InterviewCoachPage() {
  const [loading, setLoading] = useState(false);
  const [interviewPrep, setInterviewPrep] = useState<InterviewPrep | null>(null);
  const [formData, setFormData] = useState({
    role: "",
    company: "",
    experience_years: "",
    education_level: "",
    technical_skills: "",
    previous_interviews: "",
  });

  const educationLevels = [
    "High School Diploma",
    "Associate's Degree",
    "Bachelor's Degree",
    "Master's Degree",
    "Doctorate",
    "Professional Certification",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer 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",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: "You are an expert interview coach. Your response must be a valid JSON object containing interview preparation content. Do not include any explanatory text before or after the JSON object."
            },
            {
              role: "user",
              content: `Create a comprehensive interview preparation guide for this role and return ONLY a JSON object (no other text):
                Role: ${formData.role}
                Company: ${formData.company}
                Years of Experience: ${formData.experience_years}
                Education Level: ${formData.education_level}
                Technical Skills: ${formData.technical_skills}
                Previous Interview Experience: ${formData.previous_interviews}
                
                Return a JSON object with this structure:
                {
                  "common_questions": [
                    {
                      "question": "Common interview question",
                      "tips": ["Tip 1", "Tip 2", ...],
                      "sample_answer": "Sample answer"
                    }
                  ],
                  "technical_questions": [
                    {
                      "question": "Technical question",
                      "difficulty": "Easy/Medium/Hard",
                      "explanation": "Explanation of the concept",
                      "sample_answer": "Sample answer"
                    }
                  ],
                  "behavioral_questions": [
                    {
                      "question": "Behavioral question",
                      "what_they_look_for": ["Point 1", "Point 2", ...],
                      "sample_answer": "Sample answer"
                    }
                  ],
                  "interview_tips": ["Tip 1", "Tip 2", ...],
                  "preparation_checklist": ["Item 1", "Item 2", ...]
                }`
            }
          ],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('API Error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
        
        if (response.status === 401) {
          throw new Error("Invalid API key");
        } else if (response.status === 429) {
          throw new Error("Rate limit exceeded");
        } else {
          throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }
      }

      const data = await response.json();
      if (!data.choices || !data.choices[0]?.message?.content) {
        throw new Error("Invalid response format from API");
      }

      // Extract JSON object from the response
      const content = data.choices[0].message.content;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      
      if (!jsonMatch) {
        console.error("No JSON object found in response:", content);
        throw new Error("No valid JSON object found in response");
      }

      try {
        const prep = JSON.parse(jsonMatch[0]);
        setInterviewPrep(prep);
      } catch (parseError) {
        console.error("Error parsing JSON response:", parseError);
        console.error("Raw content:", jsonMatch[0]);
        throw new Error("Failed to parse AI response");
      }
    } catch (error) {
      console.error("Error preparing interview guide:", error);
      setInterviewPrep(null);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      role: "",
      company: "",
      experience_years: "",
      education_level: "",
      technical_skills: "",
      previous_interviews: "",
    });
    setInterviewPrep(null);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">AI Interview Coach</h1>
      
      <div className="grid grid-cols-1 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Interview Preparation</CardTitle>
            <CardDescription>
              Get personalized interview preparation guidance based on your role and experience.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4" suppressHydrationWarning>
              <div className="space-y-2">
                <label className="text-sm font-medium">Role</label>
                <Input
                  placeholder="The role you're interviewing for"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  suppressHydrationWarning
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Company</label>
                <Input
                  placeholder="Company name (optional)"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  suppressHydrationWarning
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Years of Experience</label>
                <Input
                  type="number"
                  placeholder="Enter number of years"
                  value={formData.experience_years}
                  onChange={(e) => setFormData({ ...formData, experience_years: e.target.value })}
                  suppressHydrationWarning
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Education Level</label>
                <Select
                  value={formData.education_level}
                  onValueChange={(value) => setFormData({ ...formData, education_level: value })}
                >
                  <SelectTrigger suppressHydrationWarning>
                    <SelectValue placeholder="Select your education level" />
                  </SelectTrigger>
                  <SelectContent>
                    {educationLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Technical Skills</label>
                <Textarea
                  placeholder="List your technical skills and expertise"
                  value={formData.technical_skills}
                  onChange={(e) => setFormData({ ...formData, technical_skills: e.target.value })}
                  className="min-h-[80px]"
                  suppressHydrationWarning
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Previous Interview Experience</label>
                <Textarea
                  placeholder="Describe your previous interview experiences and any specific areas you want to improve"
                  value={formData.previous_interviews}
                  onChange={(e) => setFormData({ ...formData, previous_interviews: e.target.value })}
                  className="min-h-[80px]"
                  suppressHydrationWarning
                />
              </div>
              
              <div className="flex gap-4">
                <Button type="submit" className="flex-1" disabled={loading} suppressHydrationWarning>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Preparing Interview Guide...
                    </>
                  ) : (
                    "Get Interview Guide"
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleReset}
                  disabled={loading}
                  suppressHydrationWarning
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset Form
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {interviewPrep && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Common Questions</CardTitle>
                <CardDescription>Frequently asked questions and how to answer them</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {interviewPrep.common_questions.map((q, index) => (
                    <div key={index} className="space-y-4">
                      <h4 className="font-medium">{q.question}</h4>
                      <div>
                        <h5 className="text-sm font-medium mb-2">Tips:</h5>
                        <ul className="list-disc list-inside space-y-1">
                          {q.tips.map((tip, i) => (
                            <li key={i} className="text-sm text-muted-foreground">
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium mb-2">Sample Answer:</h5>
                        <p className="text-sm text-muted-foreground">{q.sample_answer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Technical Questions</CardTitle>
                <CardDescription>Technical questions you might encounter</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {interviewPrep.technical_questions.map((q, index) => (
                    <div key={index} className="space-y-4">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">{q.question}</h4>
                        <span className="text-sm px-2 py-1 rounded-full bg-muted">
                          {q.difficulty}
                        </span>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium mb-2">Explanation:</h5>
                        <p className="text-sm text-muted-foreground">{q.explanation}</p>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium mb-2">Sample Answer:</h5>
                        <p className="text-sm text-muted-foreground">{q.sample_answer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Behavioral Questions</CardTitle>
                <CardDescription>Behavioral questions and what interviewers look for</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {interviewPrep.behavioral_questions.map((q, index) => (
                    <div key={index} className="space-y-4">
                      <h4 className="font-medium">{q.question}</h4>
                      <div>
                        <h5 className="text-sm font-medium mb-2">What They Look For:</h5>
                        <ul className="list-disc list-inside space-y-1">
                          {q.what_they_look_for.map((point, i) => (
                            <li key={i} className="text-sm text-muted-foreground">
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium mb-2">Sample Answer:</h5>
                        <p className="text-sm text-muted-foreground">{q.sample_answer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Interview Tips</CardTitle>
                  <CardDescription>General tips for interview success</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2">
                    {interviewPrep.interview_tips.map((tip, index) => (
                      <li key={index} className="text-sm text-muted-foreground">
                        {tip}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Preparation Checklist</CardTitle>
                  <CardDescription>Things to do before your interview</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2">
                    {interviewPrep.preparation_checklist.map((item, index) => (
                      <li key={index} className="text-sm text-muted-foreground">
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 