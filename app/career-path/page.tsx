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

interface CareerRecommendation {
  title: string;
  description: string;
  required_skills: string[];
  salary_range: string;
  growth_potential: string;
  why_recommended: string;
}

export default function CareerPathPage() {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<CareerRecommendation[]>([]);
  const [formData, setFormData] = useState({
    desired_role: "",
    technical_skills: "",
    soft_skills: "",
    experience_years: "",
    education_level: "",
    preferred_industry: "",
    preferred_location: "",
    work_preferences: "",
  });
  const [experienceError, setExperienceError] = useState("");

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

  const validateExperience = (value: string) => {
    const num = Number(value);
    if (isNaN(num) || num < 0) {
      setExperienceError("Please enter a valid number of years");
      return false;
    }
    setExperienceError("");
    return true;
  };

  const handleExperienceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData({ ...formData, experience_years: value });
    validateExperience(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateExperience(formData.experience_years)) {
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
              content: "You are a career guidance expert. Analyze the user's profile and recommend suitable career paths that align with their skills, experience, and preferences. Provide detailed explanations for each recommendation."
            },
            {
              role: "user",
              content: `Based on the following profile, recommend 3 suitable career paths:
                Desired Role: ${formData.desired_role}
                Technical Skills: ${formData.technical_skills}
                Soft Skills: ${formData.soft_skills}
                Years of Experience: ${formData.experience_years}
                Education Level: ${formData.education_level}
                Preferred Industry: ${formData.preferred_industry}
                Preferred Location: ${formData.preferred_location}
                Work Preferences: ${formData.work_preferences}
                
                Please format the response as a JSON array with the following structure for each career path:
                {
                  "title": "Career Path Title",
                  "description": "Detailed description of the career path",
                  "required_skills": ["skill1", "skill2", ...],
                  "salary_range": "Expected salary range in USD",
                  "growth_potential": "Career growth and advancement opportunities",
                  "why_recommended": "Explanation of why this career path matches the user's profile"
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

      const recommendations = JSON.parse(content);
      setRecommendations(recommendations);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      desired_role: "",
      technical_skills: "",
      soft_skills: "",
      experience_years: "",
      education_level: "",
      preferred_industry: "",
      preferred_location: "",
      work_preferences: "",
    });
    setExperienceError("");
    setRecommendations([]);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Career Path Recommendations</h1>
      
      <div className="grid grid-cols-1 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>
              Tell us about your skills, experience, and preferences to get personalized career path recommendations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Desired Role</label>
                <Input
                  placeholder="e.g., Software Engineer, Data Scientist, Project Manager"
                  value={formData.desired_role}
                  onChange={(e) => setFormData({ ...formData, desired_role: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Technical Skills</label>
                <Textarea
                  placeholder="List your technical skills, programming languages, tools, and certifications"
                  value={formData.technical_skills}
                  onChange={(e) => setFormData({ ...formData, technical_skills: e.target.value })}
                  className="min-h-[80px]"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Soft Skills</label>
                <Textarea
                  placeholder="List your soft skills, such as communication, leadership, problem-solving"
                  value={formData.soft_skills}
                  onChange={(e) => setFormData({ ...formData, soft_skills: e.target.value })}
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Years of Experience</label>
                <Input
                  type="number"
                  placeholder="Enter number of years"
                  value={formData.experience_years}
                  onChange={handleExperienceChange}
                  className={experienceError ? "border-red-500" : ""}
                />
                {experienceError && (
                  <p className="text-sm text-red-500">{experienceError}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Education Level</label>
                <Select
                  value={formData.education_level}
                  onValueChange={(value) => setFormData({ ...formData, education_level: value })}
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
              
              <div className="flex gap-4">
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Finding Recommendations...
                    </>
                  ) : (
                    "Get Career Recommendations"
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

        {recommendations.length > 0 && (
          <div className="space-y-6">
            {recommendations.map((recommendation, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{recommendation.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Description</h4>
                      <p className="text-sm text-muted-foreground">{recommendation.description}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Required Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {recommendation.required_skills.map((skill, i) => (
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
                        <p className="text-sm">{recommendation.salary_range}</p>
                      </div>
                      <div>
                        <h4 className="font-medium">Growth Potential</h4>
                        <p className="text-sm">{recommendation.growth_potential}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">Why Recommended</h4>
                      <p className="text-sm text-muted-foreground">{recommendation.why_recommended}</p>
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