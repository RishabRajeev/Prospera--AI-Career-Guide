"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import Header from "./components/Header";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import CareerDemandChart from "./components/CareerDemandChart";
import SkillDemandChart from "./components/SkillDemandChart";

interface TopJob {
  title: string;
  salary: string;
  description: string;
  industry: string;
  growth_rate?: string;
  required_skills?: string[];
}

export default function Home() {
  const [topJobs, setTopJobs] = useState<TopJob[]>([]);
  const [topJobsLoading, setTopJobsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchTopJobs();
  }, []);

  const fetchTopJobs = async () => {
    try {
      setTopJobsLoading(true);
      const prompt = `List the top 3 highest paying jobs across different industries (not just tech). 
      Include a mix of industries like healthcare, finance, law, engineering, etc.
      For each job, provide:
      - Job title
      - Industry sector
      - Average salary range (in USD)
      - Brief description of the role
      - Projected growth rate over the next 5 years
      - Key required skills (3-4 most important)

      Format the response as a JSON array:
      [
        {
          "title": "Job title",
          "industry": "Industry sector",
          "salary": "Salary range",
          "description": "Role description",
          "growth_rate": "Projected growth rate",
          "required_skills": ["Skill 1", "Skill 2", "Skill 3"]
        }
      ]`;

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer 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`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: "You are a career expert specializing in salary information and job market trends. Provide accurate, up-to-date information across various industries. Return ONLY valid JSON without any markdown formatting or additional text. Include realistic salary ranges based on current market data."
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("API Error:", errorData);
        
        if (response.status === 429) {
          throw new Error("Rate limit exceeded. Please try again in a few minutes.");
        }
        
        if (response.status === 401) {
          throw new Error("Invalid API key. Please check your configuration.");
        }
        
        throw new Error(errorData.error?.message || "Failed to fetch top jobs");
      }

      const data = await response.json();
      if (!data.choices?.[0]?.message?.content) {
        throw new Error("Invalid API response format");
      }

      const content = data.choices[0].message.content;
      const cleanContent = content.replace(/```json\n?|\n?```/g, "").trim();
      
      try {
        const jobs = JSON.parse(cleanContent);
        if (Array.isArray(jobs)) {
          setTopJobs(jobs);
        } else {
          throw new Error("Invalid jobs data format");
        }
      } catch (parseError) {
        console.error("Error parsing response:", parseError);
        throw new Error("Failed to parse jobs data");
      }
    } catch (error) {
      console.error("Error fetching top jobs:", error);
      toast.error(error instanceof Error ? error.message : "Failed to fetch top jobs");
      // Fallback to default jobs
      setTopJobs([
        {
          title: "Chief Technology Officer",
          industry: "Technology",
          salary: "$200,000 - $400,000",
          description: "Senior executive responsible for technology strategy and implementation",
          growth_rate: "15%",
          required_skills: ["Strategic Planning", "Technical Leadership", "Business Acumen"]
        },
        {
          title: "Medical Surgeon",
          industry: "Healthcare",
          salary: "$300,000 - $600,000",
          description: "Specialized physician performing surgical procedures",
          growth_rate: "10%",
          required_skills: ["Surgical Expertise", "Patient Care", "Decision Making"]
        },
        {
          title: "Investment Banker",
          industry: "Finance",
          salary: "$150,000 - $500,000",
          description: "Financial professional handling mergers, acquisitions, and capital raising",
          growth_rate: "12%",
          required_skills: ["Financial Analysis", "Deal Structuring", "Client Relations"]
        }
      ]);
    } finally {
      setTopJobsLoading(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative w-12 h-12">
              <Image
                src="/prospera-logo.svg"
                alt="Prospera Logo"
                fill
                priority
                className="object-contain"
              />
            </div>
            <h1 className="text-4xl font-bold">Welcome to Prospera</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Your AI-powered career guidance platform. Select a category from the sidebar to get started.
          </p>

          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Top Paying Jobs</h2>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchTopJobs}
                disabled={topJobsLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${topJobsLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {topJobsLoading ? (
                <div className="col-span-3 flex justify-center">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                topJobs.map((job, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <span className="text-sm font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                          {job.industry}
                        </span>
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <span>{job.salary}</span>
                        {job.growth_rate && (
                          <span className="text-green-500 text-sm">
                            ↑ {job.growth_rate} growth
                          </span>
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <h3 className="font-semibold mb-2">{job.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{job.description}</p>
                      {job.required_skills && job.required_skills.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium mb-2">Key Skills:</h4>
                          <div className="flex flex-wrap gap-2">
                            {job.required_skills.map((skill, idx) => (
                              <span
                                key={idx}
                                className="text-xs px-2 py-1 rounded-full bg-muted"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Market Insights Section */}
          <section className="py-12 bg-muted/50">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold mb-8">Market Insights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <CareerDemandChart />
                <SkillDemandChart />
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}