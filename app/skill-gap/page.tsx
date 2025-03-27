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

interface SkillGap {
  skill: string;
  current_level: string;
  required_level: string;
  importance: string;
  learning_path: string[];
  resources: string[];
  estimated_time: string;
}

export default function SkillGapPage() {
  const [loading, setLoading] = useState(false);
  const [skillGaps, setSkillGaps] = useState<SkillGap[]>([]);
  const [formData, setFormData] = useState({
    current_role: "",
    target_role: "",
    current_skills: "",
    experience_years: "",
    education_level: "",
    preferred_learning_style: "",
    time_commitment: "",
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

  const learningStyles = [
    "Visual Learning",
    "Auditory Learning",
    "Reading/Writing",
    "Kinesthetic Learning",
    "Mixed Learning Style",
  ];

  const timeCommitments = [
    "1-2 hours per week",
    "3-5 hours per week",
    "6-10 hours per week",
    "10+ hours per week",
    "Full-time learning",
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
              content: "You are a career development expert. Your response must be a valid JSON array containing skill gaps. Do not include any explanatory text before or after the JSON array."
            },
            {
              role: "user",
              content: `Analyze the skill gaps needed for this career transition and return ONLY a JSON array (no other text):
                Current Role: ${formData.current_role}
                Target Role: ${formData.target_role}
                Current Skills: ${formData.current_skills}
                Years of Experience: ${formData.experience_years}
                Education Level: ${formData.education_level}
                Preferred Learning Style: ${formData.preferred_learning_style}
                Time Commitment: ${formData.time_commitment}
                
                Return a JSON array with this structure for each skill gap:
                {
                  "skill": "Name of the skill",
                  "current_level": "Current proficiency level",
                  "required_level": "Required proficiency level",
                  "importance": "Importance of this skill for the target role",
                  "learning_path": ["Step 1", "Step 2", ...],
                  "resources": ["Resource 1", "Resource 2", ...],
                  "estimated_time": "Estimated time to acquire this skill"
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

      // Extract JSON array from the response
      const content = data.choices[0].message.content;
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      
      if (!jsonMatch) {
        console.error("No JSON array found in response:", content);
        throw new Error("No valid JSON array found in response");
      }

      try {
        const gaps = JSON.parse(jsonMatch[0]);
        setSkillGaps(gaps);
      } catch (parseError) {
        console.error("Error parsing JSON response:", parseError);
        console.error("Raw content:", jsonMatch[0]);
        throw new Error("Failed to parse AI response");
      }
    } catch (error) {
      console.error("Error analyzing skill gaps:", error);
      setSkillGaps([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      current_role: "",
      target_role: "",
      current_skills: "",
      experience_years: "",
      education_level: "",
      preferred_learning_style: "",
      time_commitment: "",
    });
    setExperienceError("");
    setSkillGaps([]);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Skill Gap Analysis</h1>
      
      <div className="grid grid-cols-1 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>
              Tell us about your current role and target role to identify the skills you need to develop.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Current Role</label>
                <Input
                  placeholder="Your current job title or role"
                  value={formData.current_role}
                  onChange={(e) => setFormData({ ...formData, current_role: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Target Role</label>
                <Input
                  placeholder="The role you want to transition to"
                  value={formData.target_role}
                  onChange={(e) => setFormData({ ...formData, target_role: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Current Skills</label>
                <Textarea
                  placeholder="List your current skills, certifications, and technical expertise"
                  value={formData.current_skills}
                  onChange={(e) => setFormData({ ...formData, current_skills: e.target.value })}
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
                <label className="text-sm font-medium">Preferred Learning Style</label>
                <Select
                  value={formData.preferred_learning_style}
                  onValueChange={(value) => setFormData({ ...formData, preferred_learning_style: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your preferred learning style" />
                  </SelectTrigger>
                  <SelectContent>
                    {learningStyles.map((style) => (
                      <SelectItem key={style} value={style}>
                        {style}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Time Commitment</label>
                <Select
                  value={formData.time_commitment}
                  onValueChange={(value) => setFormData({ ...formData, time_commitment: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your available time commitment" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeCommitments.map((commitment) => (
                      <SelectItem key={commitment} value={commitment}>
                        {commitment}
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
                      Analyzing Skill Gaps...
                    </>
                  ) : (
                    "Analyze Skill Gaps"
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

        {skillGaps.length > 0 && (
          <div className="space-y-6">
            {skillGaps.map((gap, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{gap.skill}</CardTitle>
                  <CardDescription>
                    Current Level: {gap.current_level} → Required Level: {gap.required_level}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Importance</h4>
                      <p className="text-sm text-muted-foreground">{gap.importance}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Learning Path</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {gap.learning_path.map((step, i) => (
                          <li key={i} className="text-sm text-muted-foreground">
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Recommended Resources</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {gap.resources.map((resource, i) => (
                          <li key={i} className="text-sm text-muted-foreground">
                            {resource}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">Estimated Time</h4>
                      <p className="text-sm">{gap.estimated_time}</p>
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