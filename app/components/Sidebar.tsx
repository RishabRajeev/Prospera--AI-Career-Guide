"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Menu } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className={cn(
      "fixed top-0 left-0 h-screen bg-background border-r transition-all duration-300 ease-in-out z-50 overflow-hidden",
      isOpen ? "w-[300px]" : "w-0"
    )}>
      <div className="h-full flex flex-col">
        <div className="p-4 border-b">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2"
            onClick={() => setIsOpen(false)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="career-guidance">
              <AccordionTrigger className="text-lg font-semibold text-left">
                Career Guidance
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <Link
                    href="/career-path"
                    className={cn(
                      "flex w-full items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                      pathname === "/career-path" && "bg-accent text-accent-foreground"
                    )}
                  >
                    Career Path Recommendations
                  </Link>
                  <Link
                    href="/job-matching"
                    className={cn(
                      "flex w-full items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                      pathname === "/job-matching" && "bg-accent text-accent-foreground"
                    )}
                  >
                    Job Matching
                  </Link>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="skill-development">
              <AccordionTrigger className="text-lg font-semibold text-left">
                Skill Development & Learning
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <Link
                    href="/skill-gap"
                    className={cn(
                      "flex w-full items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                      pathname === "/skill-gap" && "bg-accent text-accent-foreground"
                    )}
                  >
                    Skill Gap Analysis
                  </Link>
                  <Link
                    href="/soft-skills"
                    className={cn(
                      "flex w-full items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                      pathname === "/soft-skills" && "bg-accent text-accent-foreground"
                    )}
                  >
                    Soft Skills & Personality Analysis
                  </Link>
                  <Link
                    href="/learning-path"
                    className={cn(
                      "flex w-full items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                      pathname === "/learning-path" && "bg-accent text-accent-foreground"
                    )}
                  >
                    Personalized Learning Paths
                  </Link>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="interview-prep">
              <AccordionTrigger className="text-lg font-semibold text-left">
                Interview & Portfolio Prep
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <Link
                    href="/interview-coach"
                    className={cn(
                      "flex w-full items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                      pathname === "/interview-coach" && "bg-accent text-accent-foreground"
                    )}
                  >
                    AI-Powered Interview Coach
                  </Link>
                  <Link
                    href="/mock-interviews"
                    className={cn(
                      "flex w-full items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                      pathname === "/mock-interviews" && "bg-accent text-accent-foreground"
                    )}
                  >
                    Mock Interview Sessions
                  </Link>
                  <Link
                    href="/resume-analysis"
                    className={cn(
                      "flex w-full items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                      pathname === "/resume-analysis" && "bg-accent text-accent-foreground"
                    )}
                  >
                    Resume & Cover Letter Analysis
                  </Link>
                  <Link
                    href="/portfolio-review"
                    className={cn(
                      "flex w-full items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                      pathname === "/portfolio-review" && "bg-accent text-accent-foreground"
                    )}
                  >
                    Portfolio Review
                  </Link>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="salary-insights">
              <AccordionTrigger className="text-lg font-semibold text-left">
                Salary & Market Insights
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <Link
                    href="/salary-insights"
                    className={cn(
                      "flex w-full items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                      pathname === "/salary-insights" && "bg-accent text-accent-foreground"
                    )}
                  >
                    Salary Insights & Trends
                  </Link>
                  <Link
                    href="/opportunities"
                    className={cn(
                      "flex w-full items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                      pathname === "/opportunities" && "bg-accent text-accent-foreground"
                    )}
                  >
                    Internship & Freelance Opportunities
                  </Link>
                  <Link
                    href="/career-tips"
                    className={cn(
                      "flex w-full items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                      pathname === "/career-tips" && "bg-accent text-accent-foreground"
                    )}
                  >
                    Daily Career Tips & News
                  </Link>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="ai-roadmap">
              <AccordionTrigger className="text-lg font-semibold text-left">
                AI Career Roadmap
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <Link
                    href="/career-roadmap"
                    className={cn(
                      "flex w-full items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                      pathname === "/career-roadmap" && "bg-accent text-accent-foreground"
                    )}
                  >
                    AI Career Roadmap Generator
                  </Link>
                  <Link
                    href="/job-tracker"
                    className={cn(
                      "flex w-full items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                      pathname === "/job-tracker" && "bg-accent text-accent-foreground"
                    )}
                  >
                    Job Application Tracker
                  </Link>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {!isOpen && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed left-0 top-4 z-50"
          onClick={() => setIsOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
} 