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

interface SalaryInsights {
  salary_range: {
    entry_level: string;
    mid_level: string;
    senior_level: string;
    expert_level: string;
  };
  market_trends: {
    trend: string;
    explanation: string;
    impact: string;
  }[];
  location_factors: {
    factor: string;
    impact: string;
    tips: string[];
  }[];
  benefits_and_perks: {
    common_benefits: string[];
    industry_specific: string[];
    negotiation_tips: string[];
  };
  growth_potential: {
    career_path: string[];
    salary_progression: string[];
    skills_for_growth: string[];
  };
}

export default function SalaryInsightsPage() {
  const [loading, setLoading] = useState(false);
  const [salaryInsights, setSalaryInsights] = useState<SalaryInsights | null>(null);
  const [formData, setFormData] = useState({
    role: "",
    location: "",
    experience_years: "",
    education_level: "",
    industry: "",
    company_size: "",
  });

  const educationLevels = [
    "High School Diploma",
    "Associate's Degree",
    "Bachelor's Degree",
    "Master's Degree",
    "Doctorate",
    "Professional Certification",
  ];

  const companySizes = [
    "Startup (1-50 employees)",
    "Small (51-200 employees)",
    "Medium (201-500 employees)",
    "Large (501-1000 employees)",
    "Enterprise (1000+ employees)",
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
              content: "You are a compensation and market analysis expert. Your response must be a valid JSON object containing salary insights and trends. Do not include any explanatory text before or after the JSON object."
            },
            {
              role: "user",
              content: `Analyze salary insights and trends for this role and return ONLY a JSON object (no other text):
                Role: ${formData.role}
                Location: ${formData.location}
                Years of Experience: ${formData.experience_years}
                Education Level: ${formData.education_level}
                Industry: ${formData.industry}
                Company Size: ${formData.company_size}
                
                Return a JSON object with this structure:
                {
                  "salary_range": {
                    "entry_level": "Salary range for entry level",
                    "mid_level": "Salary range for mid level",
                    "senior_level": "Salary range for senior level",
                    "expert_level": "Salary range for expert level"
                  },
                  "market_trends": [
                    {
                      "trend": "Current market trend",
                      "explanation": "Explanation of the trend",
                      "impact": "Impact on salary"
                    }
                  ],
                  "location_factors": [
                    {
                      "factor": "Location factor affecting salary",
                      "impact": "How it affects salary",
                      "tips": ["Tip 1", "Tip 2", ...]
                    }
                  ],
                  "benefits_and_perks": {
                    "common_benefits": ["Benefit 1", "Benefit 2", ...],
                    "industry_specific": ["Industry benefit 1", "Industry benefit 2", ...],
                    "negotiation_tips": ["Tip 1", "Tip 2", ...]
                  },
                  "growth_potential": {
                    "career_path": ["Path 1", "Path 2", ...],
                    "salary_progression": ["Progression 1", "Progression 2", ...],
                    "skills_for_growth": ["Skill 1", "Skill 2", ...]
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
        const insights = JSON.parse(jsonMatch[0]);
        setSalaryInsights(insights);
      } catch (parseError) {
        console.error("Error parsing JSON response:", parseError);
        console.error("Raw content:", jsonMatch[0]);
        throw new Error("Failed to parse AI response");
      }
    } catch (error) {
      console.error("Error fetching salary insights:", error);
      setSalaryInsights(null);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      role: "",
      location: "",
      experience_years: "",
      education_level: "",
      industry: "",
      company_size: "",
    });
    setSalaryInsights(null);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Salary Insights & Trends</h1>
      
      <div className="grid grid-cols-1 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Salary Analysis</CardTitle>
            <CardDescription>
              Get detailed salary insights and market trends for your role.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4" suppressHydrationWarning>
              <div className="space-y-2">
                <label className="text-sm font-medium">Role</label>
                <Input
                  placeholder="The role you're interested in"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  suppressHydrationWarning
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Input
                  placeholder="City, State, or Country"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
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
                <label className="text-sm font-medium">Industry</label>
                <Input
                  placeholder="e.g., Technology, Healthcare, Finance"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  suppressHydrationWarning
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Company Size</label>
                <Select
                  value={formData.company_size}
                  onValueChange={(value) => setFormData({ ...formData, company_size: value })}
                >
                  <SelectTrigger suppressHydrationWarning>
                    <SelectValue placeholder="Select company size" />
                  </SelectTrigger>
                  <SelectContent>
                    {companySizes.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-4">
                <Button type="submit" className="flex-1" disabled={loading} suppressHydrationWarning>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing Salary Data...
                    </>
                  ) : (
                    "Get Salary Insights"
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

        {salaryInsights && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Salary Ranges</CardTitle>
                <CardDescription>Expected salary ranges by experience level</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Entry Level</h4>
                    <p className="text-sm text-muted-foreground">{salaryInsights.salary_range.entry_level}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Mid Level</h4>
                    <p className="text-sm text-muted-foreground">{salaryInsights.salary_range.mid_level}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Senior Level</h4>
                    <p className="text-sm text-muted-foreground">{salaryInsights.salary_range.senior_level}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Expert Level</h4>
                    <p className="text-sm text-muted-foreground">{salaryInsights.salary_range.expert_level}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Market Trends</CardTitle>
                <CardDescription>Current trends affecting salary in this role</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {salaryInsights.market_trends.map((trend, index) => (
                    <div key={index} className="space-y-2">
                      <h4 className="font-medium">{trend.trend}</h4>
                      <p className="text-sm text-muted-foreground">{trend.explanation}</p>
                      <p className="text-sm text-muted-foreground">Impact: {trend.impact}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Location Factors</CardTitle>
                <CardDescription>How location affects salary and compensation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {salaryInsights.location_factors.map((factor, index) => (
                    <div key={index} className="space-y-2">
                      <h4 className="font-medium">{factor.factor}</h4>
                      <p className="text-sm text-muted-foreground">{factor.impact}</p>
                      <div>
                        <h5 className="text-sm font-medium mb-2">Tips:</h5>
                        <ul className="list-disc list-inside space-y-1">
                          {factor.tips.map((tip, i) => (
                            <li key={i} className="text-sm text-muted-foreground">
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Benefits & Perks</CardTitle>
                  <CardDescription>Common benefits and negotiation tips</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Common Benefits</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {salaryInsights.benefits_and_perks.common_benefits.map((benefit, index) => (
                          <li key={index} className="text-sm text-muted-foreground">
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Industry-Specific Benefits</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {salaryInsights.benefits_and_perks.industry_specific.map((benefit, index) => (
                          <li key={index} className="text-sm text-muted-foreground">
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Negotiation Tips</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {salaryInsights.benefits_and_perks.negotiation_tips.map((tip, index) => (
                          <li key={index} className="text-sm text-muted-foreground">
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Growth Potential</CardTitle>
                  <CardDescription>Career progression and salary growth opportunities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Career Path</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {salaryInsights.growth_potential.career_path.map((path, index) => (
                          <li key={index} className="text-sm text-muted-foreground">
                            {path}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Salary Progression</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {salaryInsights.growth_potential.salary_progression.map((progression, index) => (
                          <li key={index} className="text-sm text-muted-foreground">
                            {progression}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Skills for Growth</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {salaryInsights.growth_potential.skills_for_growth.map((skill, index) => (
                          <li key={index} className="text-sm text-muted-foreground">
                            {skill}
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