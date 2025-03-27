"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, RefreshCw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CareerRoadmap {
  current_state: {
    skills: string[];
    experience: string[];
    education: string[];
    certifications: string[];
    academic_performance: string[];
    extracurricular_activities: string[];
  };
  target_state: {
    required_skills: string[];
    required_experience: string[];
    required_education: string[];
    required_certifications: string[];
    industry_requirements: string[];
  };
  timeline: {
    phase: string;
    duration: string;
    milestones: {
      title: string;
      description: string;
      resources: string[];
      estimated_time: string;
      academic_requirements?: string[];
      internship_opportunities?: string[];
    }[];
  }[];
  skill_gaps: {
    skill: string;
    current_level: string;
    target_level: string;
    learning_path: string[];
    resources: string[];
    academic_courses?: string[];
    online_courses?: string[];
  }[];
  networking_strategy: {
    platforms: string[];
    communities: string[];
    events: string[];
    mentorship_opportunities: string[];
    student_organizations: string[];
    academic_networks: string[];
  };
  success_metrics: {
    short_term: string[];
    medium_term: string[];
    long_term: string[];
    academic_goals: string[];
    career_goals: string[];
  };
}

export default function CareerRoadmapPage() {
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<CareerRoadmap | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;
  const [formData, setFormData] = useState({
    current_role: "",
    target_role: "",
    experience_years: "",
    education_level: "",
    current_skills: "",
    timeline_years: "",
    preferred_learning_style: "",
    is_student: false,
    current_major: "",
    current_year: "",
    gpa: "",
    extracurricular_activities: "",
    internship_experience: "",
    target_industry: "",
  });

  const educationLevels = [
    "High School",
    "Freshman",
    "Sophomore",
    "Junior",
    "Senior",
    "Graduate Student",
    "Professional",
  ];

  const learningStyles = [
    "Visual Learning",
    "Auditory Learning",
    "Reading/Writing",
    "Kinesthetic Learning",
    "Mixed Learning Style",
  ];

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setRetryCount(0);

    const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;
    if (!apiKey) {
      setError("API key not configured. Please set up your Groq API key in the .env.local file.");
      setLoading(false);
      return;
    }

    while (retryCount < maxRetries) {
      try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
              {
                role: "system",
                content: "You are a career development expert specializing in student career planning. Your response must be a valid JSON object containing a detailed career roadmap. Do not include any explanatory text before or after the JSON object."
              },
              {
                role: "user",
                content: `Create a detailed career roadmap for transitioning from current role to target role and return ONLY a JSON object (no other text):
                  Current Role: ${formData.current_role}
                  Target Role: ${formData.target_role}
                  Years of Experience: ${formData.experience_years}
                  Education Level: ${formData.education_level}
                  Current Skills: ${formData.current_skills}
                  Timeline (Years): ${formData.timeline_years}
                  Preferred Learning Style: ${formData.preferred_learning_style}
                  Is Student: ${formData.is_student}
                  Current Major: ${formData.current_major}
                  Current Year: ${formData.current_year}
                  GPA: ${formData.gpa}
                  Extracurricular Activities: ${formData.extracurricular_activities}
                  Internship Experience: ${formData.internship_experience}
                  Target Industry: ${formData.target_industry}
                  
                  Return a JSON object with this structure:
                  {
                    "current_state": {
                      "skills": ["Current skill 1", "Current skill 2", ...],
                      "experience": ["Experience 1", "Experience 2", ...],
                      "education": ["Education 1", "Education 2", ...],
                      "certifications": ["Certification 1", "Certification 2", ...],
                      "academic_performance": ["Academic achievement 1", "Academic achievement 2", ...],
                      "extracurricular_activities": ["Activity 1", "Activity 2", ...]
                    },
                    "target_state": {
                      "required_skills": ["Required skill 1", "Required skill 2", ...],
                      "required_experience": ["Required experience 1", "Required experience 2", ...],
                      "required_education": ["Required education 1", "Required education 2", ...],
                      "required_certifications": ["Required certification 1", "Required certification 2", ...],
                      "industry_requirements": ["Industry requirement 1", "Industry requirement 2", ...]
                    },
                    "timeline": [
                      {
                        "phase": "Phase name",
                        "duration": "Duration of phase",
                        "milestones": [
                          {
                            "title": "Milestone title",
                            "description": "Milestone description",
                            "resources": ["Resource 1", "Resource 2", ...],
                            "estimated_time": "Estimated time to complete",
                            "academic_requirements": ["Academic requirement 1", "Academic requirement 2", ...],
                            "internship_opportunities": ["Opportunity 1", "Opportunity 2", ...]
                          }
                        ]
                      }
                    ],
                    "skill_gaps": [
                      {
                        "skill": "Skill name",
                        "current_level": "Current proficiency level",
                        "target_level": "Required proficiency level",
                        "learning_path": ["Step 1", "Step 2", ...],
                        "resources": ["Resource 1", "Resource 2", ...],
                        "academic_courses": ["Course 1", "Course 2", ...],
                        "online_courses": ["Course 1", "Course 2", ...]
                      }
                    ],
                    "networking_strategy": {
                      "platforms": ["Platform 1", "Platform 2", ...],
                      "communities": ["Community 1", "Community 2", ...],
                      "events": ["Event 1", "Event 2", ...],
                      "mentorship_opportunities": ["Opportunity 1", "Opportunity 2", ...],
                      "student_organizations": ["Organization 1", "Organization 2", ...],
                      "academic_networks": ["Network 1", "Network 2", ...]
                    },
                    "success_metrics": {
                      "short_term": ["Metric 1", "Metric 2", ...],
                      "medium_term": ["Metric 1", "Metric 2", ...],
                      "long_term": ["Metric 1", "Metric 2", ...],
                      "academic_goals": ["Goal 1", "Goal 2", ...],
                      "career_goals": ["Goal 1", "Goal 2", ...]
                    }
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
            throw new Error("Invalid API key. Please check your API key configuration.");
          } else if (response.status === 429) {
            if (retryCount < maxRetries - 1) {
              setRetryCount(prev => prev + 1);
              const waitTime = Math.pow(2, retryCount + 1) * 1000; // Exponential backoff
              await delay(waitTime);
              continue;
            }
            throw new Error("Rate limit exceeded. Please try again in a few minutes.");
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
          const roadmapData = JSON.parse(jsonMatch[0]);
          setRoadmap(roadmapData);
          return; // Success, exit the retry loop
        } catch (parseError) {
          console.error("Error parsing JSON response:", parseError);
          console.error("Raw content:", jsonMatch[0]);
          throw new Error("Failed to parse AI response");
        }
      } catch (error) {
        console.error("Error generating career roadmap:", error);
        setError(error instanceof Error ? error.message : "An unexpected error occurred");
        setRoadmap(null);
        
        if (retryCount < maxRetries - 1) {
          setRetryCount(prev => prev + 1);
          const waitTime = Math.pow(2, retryCount + 1) * 1000;
          await delay(waitTime);
          continue;
        }
      }
    }
    setLoading(false);
  };

  const handleReset = () => {
    setFormData({
      current_role: "",
      target_role: "",
      experience_years: "",
      education_level: "",
      current_skills: "",
      timeline_years: "",
      preferred_learning_style: "",
      is_student: false,
      current_major: "",
      current_year: "",
      gpa: "",
      extracurricular_activities: "",
      internship_experience: "",
      target_industry: "",
    });
    setRoadmap(null);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">AI Career Roadmap Generator</h1>
      
      <div className="grid grid-cols-1 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Career Transition Planning</CardTitle>
            <CardDescription>
              Generate a personalized step-by-step roadmap to reach your career goals.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4" suppressHydrationWarning>
              <div className="space-y-2">
                <label className="text-sm font-medium">Current Role</label>
                <Input
                  placeholder="Your current job title, role, or student status"
                  value={formData.current_role}
                  onChange={(e) => setFormData({ ...formData, current_role: e.target.value })}
                  suppressHydrationWarning
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Target Role</label>
                <Input
                  placeholder="The role you want to transition to"
                  value={formData.target_role}
                  onChange={(e) => setFormData({ ...formData, target_role: e.target.value })}
                  suppressHydrationWarning
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Years of Experience</label>
                <Input
                  type="number"
                  placeholder="Enter number of years (0 for students)"
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
                <label className="text-sm font-medium">Current Skills</label>
                <Input
                  placeholder="List your current skills, coursework, and expertise"
                  value={formData.current_skills}
                  onChange={(e) => setFormData({ ...formData, current_skills: e.target.value })}
                  suppressHydrationWarning
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Timeline (Years)</label>
                <Input
                  type="number"
                  placeholder="How many years do you want to take for this transition?"
                  value={formData.timeline_years}
                  onChange={(e) => setFormData({ ...formData, timeline_years: e.target.value })}
                  suppressHydrationWarning
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Preferred Learning Style</label>
                <Select
                  value={formData.preferred_learning_style}
                  onValueChange={(value) => setFormData({ ...formData, preferred_learning_style: value })}
                >
                  <SelectTrigger suppressHydrationWarning>
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
                <label className="text-sm font-medium">Current Major</label>
                <Input
                  placeholder="Your current major or field of study"
                  value={formData.current_major}
                  onChange={(e) => setFormData({ ...formData, current_major: e.target.value })}
                  suppressHydrationWarning
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Current Year</label>
                <Input
                  placeholder="Your current year in school (e.g., Freshman, Sophomore)"
                  value={formData.current_year}
                  onChange={(e) => setFormData({ ...formData, current_year: e.target.value })}
                  suppressHydrationWarning
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">GPA</label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Your current GPA (if applicable)"
                  value={formData.gpa}
                  onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                  suppressHydrationWarning
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Extracurricular Activities</label>
                <Input
                  placeholder="List your extracurricular activities, clubs, or organizations"
                  value={formData.extracurricular_activities}
                  onChange={(e) => setFormData({ ...formData, extracurricular_activities: e.target.value })}
                  suppressHydrationWarning
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Internship Experience</label>
                <Input
                  placeholder="List any internship experiences or relevant projects"
                  value={formData.internship_experience}
                  onChange={(e) => setFormData({ ...formData, internship_experience: e.target.value })}
                  suppressHydrationWarning
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Target Industry</label>
                <Input
                  placeholder="The industry you want to work in"
                  value={formData.target_industry}
                  onChange={(e) => setFormData({ ...formData, target_industry: e.target.value })}
                  suppressHydrationWarning
                />
              </div>
              
              <div className="flex gap-4">
                <Button 
                  type="submit" 
                  className="flex-1" 
                  disabled={loading} 
                  suppressHydrationWarning
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {retryCount > 0 ? `Retrying... (${retryCount}/${maxRetries})` : "Generating Roadmap..."}
                    </>
                  ) : (
                    "Generate Roadmap"
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

        {roadmap && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Current State</CardTitle>
                  <CardDescription>Your current qualifications and experience</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Skills</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {roadmap.current_state.skills.map((skill, index) => (
                          <li key={index} className="text-sm text-muted-foreground">
                            {skill}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Experience</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {roadmap.current_state.experience.map((exp, index) => (
                          <li key={index} className="text-sm text-muted-foreground">
                            {exp}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Education</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {roadmap.current_state.education.map((edu, index) => (
                          <li key={index} className="text-sm text-muted-foreground">
                            {edu}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Academic Performance</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {roadmap.current_state.academic_performance.map((perf, index) => (
                          <li key={index} className="text-sm text-muted-foreground">
                            {perf}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Extracurricular Activities</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {roadmap.current_state.extracurricular_activities.map((activity, index) => (
                          <li key={index} className="text-sm text-muted-foreground">
                            {activity}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Target State</CardTitle>
                  <CardDescription>Required qualifications for your target role</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Required Skills</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {roadmap.target_state.required_skills.map((skill, index) => (
                          <li key={index} className="text-sm text-muted-foreground">
                            {skill}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Required Experience</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {roadmap.target_state.required_experience.map((exp, index) => (
                          <li key={index} className="text-sm text-muted-foreground">
                            {exp}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Required Education</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {roadmap.target_state.required_education.map((edu, index) => (
                          <li key={index} className="text-sm text-muted-foreground">
                            {edu}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Industry Requirements</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {roadmap.target_state.industry_requirements.map((req, index) => (
                          <li key={index} className="text-sm text-muted-foreground">
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Timeline & Milestones</CardTitle>
                <CardDescription>Phase-by-phase plan to reach your goal</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {roadmap.timeline.map((phase, index) => (
                    <div key={index} className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Phase {index + 1}: {phase.phase}</h4>
                        <span className="text-sm text-muted-foreground">{phase.duration}</span>
                      </div>
                      <div className="space-y-4">
                        {phase.milestones.map((milestone, mIndex) => (
                          <div key={mIndex} className="space-y-2">
                            <h5 className="font-medium">{milestone.title}</h5>
                            <p className="text-sm text-muted-foreground">{milestone.description}</p>
                            <div>
                              <h6 className="text-sm font-medium mb-1">Resources:</h6>
                              <ul className="list-disc list-inside space-y-1">
                                {milestone.resources.map((resource, rIndex) => (
                                  <li key={rIndex} className="text-sm text-muted-foreground">
                                    {resource}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            {milestone.academic_requirements && (
                              <div>
                                <h6 className="text-sm font-medium mb-1">Academic Requirements:</h6>
                                <ul className="list-disc list-inside space-y-1">
                                  {milestone.academic_requirements.map((req, rIndex) => (
                                    <li key={rIndex} className="text-sm text-muted-foreground">
                                      {req}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {milestone.internship_opportunities && (
                              <div>
                                <h6 className="text-sm font-medium mb-1">Internship Opportunities:</h6>
                                <ul className="list-disc list-inside space-y-1">
                                  {milestone.internship_opportunities.map((opp, oIndex) => (
                                    <li key={oIndex} className="text-sm text-muted-foreground">
                                      {opp}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            <p className="text-sm text-muted-foreground">
                              Estimated time: {milestone.estimated_time}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Skill Gaps</CardTitle>
                <CardDescription>Skills you need to develop and how to acquire them</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {roadmap.skill_gaps.map((gap, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">{gap.skill}</h4>
                        <div className="text-sm text-muted-foreground">
                          {gap.current_level} → {gap.target_level}
                        </div>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium mb-2">Learning Path:</h5>
                        <ul className="list-disc list-inside space-y-1">
                          {gap.learning_path.map((step, sIndex) => (
                            <li key={sIndex} className="text-sm text-muted-foreground">
                              {step}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium mb-2">Resources:</h5>
                        <ul className="list-disc list-inside space-y-1">
                          {gap.resources.map((resource, rIndex) => (
                            <li key={rIndex} className="text-sm text-muted-foreground">
                              {resource}
                            </li>
                          ))}
                        </ul>
                      </div>
                      {gap.academic_courses && (
                        <div>
                          <h5 className="text-sm font-medium mb-2">Academic Courses:</h5>
                          <ul className="list-disc list-inside space-y-1">
                            {gap.academic_courses.map((course, cIndex) => (
                              <li key={cIndex} className="text-sm text-muted-foreground">
                                {course}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {gap.online_courses && (
                        <div>
                          <h5 className="text-sm font-medium mb-2">Online Courses:</h5>
                          <ul className="list-disc list-inside space-y-1">
                            {gap.online_courses.map((course, cIndex) => (
                              <li key={cIndex} className="text-sm text-muted-foreground">
                                {course}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Networking Strategy</CardTitle>
                  <CardDescription>Build your professional network</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Platforms</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {roadmap.networking_strategy.platforms.map((platform, index) => (
                          <li key={index} className="text-sm text-muted-foreground">
                            {platform}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Student Organizations</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {roadmap.networking_strategy.student_organizations.map((org, index) => (
                          <li key={index} className="text-sm text-muted-foreground">
                            {org}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Academic Networks</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {roadmap.networking_strategy.academic_networks.map((network, index) => (
                          <li key={index} className="text-sm text-muted-foreground">
                            {network}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Communities</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {roadmap.networking_strategy.communities.map((community, index) => (
                          <li key={index} className="text-sm text-muted-foreground">
                            {community}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Events</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {roadmap.networking_strategy.events.map((event, index) => (
                          <li key={index} className="text-sm text-muted-foreground">
                            {event}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Mentorship Opportunities</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {roadmap.networking_strategy.mentorship_opportunities.map((opportunity, index) => (
                          <li key={index} className="text-sm text-muted-foreground">
                            {opportunity}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Success Metrics</CardTitle>
                  <CardDescription>Track your progress with these metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Academic Goals</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {roadmap.success_metrics.academic_goals.map((goal, index) => (
                          <li key={index} className="text-sm text-muted-foreground">
                            {goal}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Career Goals</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {roadmap.success_metrics.career_goals.map((goal, index) => (
                          <li key={index} className="text-sm text-muted-foreground">
                            {goal}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Short-term Goals</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {roadmap.success_metrics.short_term.map((metric, index) => (
                          <li key={index} className="text-sm text-muted-foreground">
                            {metric}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Medium-term Goals</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {roadmap.success_metrics.medium_term.map((metric, index) => (
                          <li key={index} className="text-sm text-muted-foreground">
                            {metric}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Long-term Goals</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {roadmap.success_metrics.long_term.map((metric, index) => (
                          <li key={index} className="text-sm text-muted-foreground">
                            {metric}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 