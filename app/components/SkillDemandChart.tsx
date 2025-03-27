"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { RefreshCw, Loader2 } from "lucide-react";

interface SkillDemand {
  skill: string;
  demand: number;
  explanation: string;
}

export default function SkillDemandChart() {
  const [skillDemand, setSkillDemand] = useState<SkillDemand[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSkillDemand = async () => {
    try {
      setLoading(true);
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
              content: "You are a career development expert. Your response must be a valid JSON array containing skill demand data. Do not include any explanatory text before or after the JSON array."
            },
            {
              role: "user",
              content: `Analyze the current demand for skills in the job market and return ONLY a JSON array (no other text) with this structure:
                [
                  {
                    "skill": "Name of the skill",
                    "demand": "High/Medium/Low",
                    "explanation": "Brief explanation of why this skill is in demand"
                  }
                ]
                
                Focus on a mix of technical and non-technical skills across various industries.`
            }
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch skill demand data");
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
        const skills = JSON.parse(jsonMatch[0]);
        setSkillDemand(skills);
      } catch (parseError) {
        console.error("Error parsing JSON response:", parseError);
        console.error("Raw content:", jsonMatch[0]);
        throw new Error("Failed to parse AI response");
      }
    } catch (error) {
      console.error("Error fetching skill demand:", error);
      // Fallback data
      setSkillDemand([
        { skill: "Communication", demand: 95, explanation: "Essential across all industries for effective collaboration" },
        { skill: "Data Analysis", demand: 90, explanation: "Critical for decision-making in business and research" },
        { skill: "Project Management", demand: 85, explanation: "Valuable for organizing and leading initiatives" },
        { skill: "Digital Literacy", demand: 80, explanation: "Increasingly important in modern workplaces" },
        { skill: "Problem Solving", demand: 75, explanation: "Highly valued across all professional roles" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkillDemand();
  }, []);

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Most In-Demand Skills</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchSkillDemand}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {skillDemand.map((skill, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{skill.skill}</span>
                  <span className="text-sm text-muted-foreground">{skill.demand}%</span>
                </div>
                <Progress value={skill.demand} className="h-2" />
                <p className="text-xs text-muted-foreground">{skill.explanation}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 