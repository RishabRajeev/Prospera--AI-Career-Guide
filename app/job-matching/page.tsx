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

interface JobMatch {
  title: string;
  company: string;
  match_score: number;
  description: string;
  required_skills: string[];
  salary_range: string;
  location: string;
  why_match: string;
}

export default function JobMatchingPage() {
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState<JobMatch[]>([]);
  const [formData, setFormData] = useState({
    skills: "",
    experience: "",
    education: "",
    preferred_industry: "",
    preferred_location: "",
    work_preferences: "",
    salary_expectations: "",
  });
  const [salaryError, setSalaryError] = useState("");

  const educationLevels = [
    "High School Diploma",
    "Associate's Degree",
    "Bachelor's Degree",
    "Master's Degree",
    "Doctorate",
    "Professional Certification",
  ];

  const workPreferences = [
    "Remote Work",
    "Hybrid Work",
    "On-site Work",
    "Flexible Hours",
    "9-5 Schedule",
    "Startup Environment",
    "Corporate Environment",
    "Government/Public Sector",
  ];

  const validateSalary = (value: string) => {
    // Remove currency symbols and commas
    const cleanValue = value.replace(/[$,]/g, '');
    
    // Check if it's a valid number
    const num = Number(cleanValue);
    if (isNaN(num) || num < 0) {
      setSalaryError("Please enter a valid salary amount");
      return false;
    }
    setSalaryError("");
    return true;
  };

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData({ ...formData, salary_expectations: value });
    validateSalary(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateSalary(formData.salary_expectations)) {
      return;
    }

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
              content: "You are a job matching expert. Analyze the user's profile and recommend suitable jobs that match their skills, experience, and preferences. Provide detailed explanations for each match."
            },
            {
              role: "user",
              content: `Based on the following profile, recommend 3 suitable jobs:
                Skills: ${formData.skills}
                Experience: ${formData.experience}
                Education: ${formData.education}
                Preferred Industry: ${formData.preferred_industry}
                Preferred Location: ${formData.preferred_location}
                Work Preferences: ${formData.work_preferences}
                Salary Expectations: ${formData.salary_expectations}
                
                Please format the response as a JSON array with the following structure for each job:
                {
                  "title": "Job Title",
                  "company": "Company Name",
                  "match_score": score (0-100),
                  "description": "Job description",
                  "required_skills": ["skill1", "skill2", ...],
                  "salary_range": "Range in USD",
                  "location": "Job location",
                  "why_match": "Explanation of why this job matches the user's profile"
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

      // Clean up the response content by removing markdown code block formatting
      const content = data.choices[0].message.content
        .replace(/```json\n?/g, '') // Remove opening ```json
        .replace(/```\n?/g, '')     // Remove closing ```
        .trim();                    // Remove extra whitespace

      const matches = JSON.parse(content);
      setMatches(matches);
    } catch (error) {
      console.error("Error fetching job matches:", error);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      skills: "",
      experience: "",
      education: "",
      preferred_industry: "",
      preferred_location: "",
      work_preferences: "",
      salary_expectations: "",
    });
    setSalaryError("");
    setMatches([]);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Job Matching</h1>
      
      <div className="grid grid-cols-1 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>
              Tell us about your skills, experience, and preferences to find matching jobs.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Skills</label>
                <Textarea
                  placeholder="List your key skills, certifications, and technical expertise"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  className="min-h-[80px]"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Experience</label>
                <Textarea
                  placeholder="Describe your work experience, including years and key responsibilities"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Education</label>
                <Select
                  value={formData.education}
                  onValueChange={(value) => setFormData({ ...formData, education: value })}
                >
                  <SelectTrigger>
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
                <label className="text-sm font-medium">Preferred Industry</label>
                <Input
                  placeholder="e.g., Technology, Healthcare, Finance"
                  value={formData.preferred_industry}
                  onChange={(e) => setFormData({ ...formData, preferred_industry: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Preferred Location</label>
                <Input
                  placeholder="e.g., Remote, New York, San Francisco"
                  value={formData.preferred_location}
                  onChange={(e) => setFormData({ ...formData, preferred_location: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Work Preferences</label>
                <Select
                  value={formData.work_preferences}
                  onValueChange={(value) => setFormData({ ...formData, work_preferences: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your work preferences" />
                  </SelectTrigger>
                  <SelectContent>
                    {workPreferences.map((pref) => (
                      <SelectItem key={pref} value={pref}>
                        {pref}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Salary Expectations</label>
                <Input
                  type="number"
                  placeholder="Enter expected salary (e.g., 75000)"
                  value={formData.salary_expectations}
                  onChange={handleSalaryChange}
                  className={salaryError ? "border-red-500" : ""}
                />
                {salaryError && (
                  <p className="text-sm text-red-500">{salaryError}</p>
                )}
              </div>
              
              <div className="flex gap-4">
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Finding Matches...
                    </>
                  ) : (
                    "Find Matching Jobs"
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleReset}
                  disabled={loading}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset Form
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {matches.length > 0 && (
          <div className="space-y-6">
            {matches.map((match, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{match.title}</CardTitle>
                      <CardDescription>{match.company}</CardDescription>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium text-green-600">
                        {match.match_score}% Match
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Description</h4>
                      <p className="text-sm text-muted-foreground">{match.description}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Required Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {match.required_skills.map((skill, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-accent rounded-md text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium">Salary Range</h4>
                        <p className="text-sm">{match.salary_range}</p>
                      </div>
                      <div>
                        <h4 className="font-medium">Location</h4>
                        <p className="text-sm">{match.location}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">Why This Matches Your Profile</h4>
                      <p className="text-sm text-muted-foreground">{match.why_match}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 