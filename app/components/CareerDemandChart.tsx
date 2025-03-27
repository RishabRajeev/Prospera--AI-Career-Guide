"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { RefreshCw, Loader2 } from "lucide-react";

interface CareerDemand {
  title: string;
  demand: number;
  explanation: string;
}

export default function CareerDemandChart() {
  const [careerDemand, setCareerDemand] = useState<CareerDemand[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCareerDemand = async () => {
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
              content: "You are a career market analyst. Provide data about the most in-demand careers across all industries in the current job market. Include a mix of technology, healthcare, business, education, and other sectors."
            },
            {
              role: "user",
              content: "List the top 5 most in-demand careers across all industries in the current job market, with their demand scores (0-100). For each career, provide a brief explanation of why it's in demand. Include a diverse mix of sectors. Format as JSON array: [{\"title\": \"Career Name\", \"demand\": score, \"explanation\": \"Brief explanation\"}]"
            }
          ],
          temperature: 0.7,
          max_tokens: 1000,
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

      const careers = JSON.parse(data.choices[0].message.content);
      setCareerDemand(careers);
    } catch (error) {
      console.error("Error fetching career demand:", error);
      // Fallback data
      setCareerDemand([
        { title: "Healthcare Professional", demand: 95, explanation: "Growing demand in healthcare services and patient care" },
        { title: "Software Engineer", demand: 90, explanation: "High demand for software development across industries" },
        { title: "Business Analyst", demand: 85, explanation: "Increasing need for data-driven business decisions" },
        { title: "Teacher/Educator", demand: 80, explanation: "Essential for education and skill development" },
        { title: "Environmental Specialist", demand: 75, explanation: "Growing focus on sustainability and environmental protection" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCareerDemand();
  }, []);

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Top 5 In-Demand Careers</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchCareerDemand}
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
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {careerDemand.map((career, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{career.title}</span>
                  <span className="text-sm text-muted-foreground">{career.demand}%</span>
                </div>
                <Progress value={career.demand} className="h-2" />
                <p className="text-xs text-muted-foreground">{career.explanation}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 