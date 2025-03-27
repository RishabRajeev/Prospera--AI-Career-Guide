"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Briefcase,
  BookOpen,
  UserCheck,
  TrendingUp,
  Map,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const categories = [
  {
    id: "career-guidance",
    icon: Briefcase,
    title: "Career Guidance",
    features: [
      "Career Path Recommendations",
      "Job Matching",
    ],
  },
  {
    id: "skill-development",
    icon: BookOpen,
    title: "Skill Development & Learning",
    features: [
      "Skill Gap Analysis",
      "Soft Skills & Personality Analysis",
      "Personalized Learning Paths",
    ],
  },
  {
    id: "interview-prep",
    icon: UserCheck,
    title: "Interview & Portfolio Prep",
    features: [
      "AI-Powered Interview Coach",
      "Mock Interview Sessions",
      "Resume & Cover Letter Analysis",
      "Portfolio Review",
    ],
  },
  {
    id: "market-insights",
    icon: TrendingUp,
    title: "Salary & Market Insights",
    features: [
      "Salary Insights & Trends",
      "Internship & Freelance Opportunities",
      "Daily Career Tips & News",
    ],
  },
  {
    id: "ai-roadmap",
    icon: Map,
    title: "AI Career Roadmap",
    features: [
      "AI Career Roadmap Generator",
      "Job Application Tracker",
    ],
  },
];

export default function Sidebar() {
  return (
    <ScrollArea className="h-screen">
      <Accordion type="single" collapsible className="px-4 pt-4">
        {categories.map((category) => (
          <AccordionItem key={category.id} value={category.id}>
            <AccordionTrigger className="py-4 hover:no-underline">
              <div className="flex items-center gap-3 text-left w-full">
                <category.icon className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm font-medium">{category.title}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-1 pl-8">
                {category.features.map((feature) => (
                  <Button
                    key={feature}
                    variant="ghost"
                    className="justify-start h-9 px-2 text-sm font-normal hover:bg-muted"
                  >
                    {feature}
                  </Button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </ScrollArea>
  );
}