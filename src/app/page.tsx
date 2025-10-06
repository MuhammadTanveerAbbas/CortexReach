"use client";

import { useState, MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, BrainCircuit, Menu, Pen, Radar } from "lucide-react";
import Link from "next/link";
import Logo from "@/components/logo";
import { FullScreenLoader } from "@/components/ui/full-screen-loader";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React from "react";
import { Footer } from "@/components/footer";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCtaClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const href = e.currentTarget.href;
    router.push(new URL(href).pathname);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {isLoading && <FullScreenLoader />}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <Logo className="h-6 w-6 text-primary" />
              <span className="font-bold">CortexReach</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <ThemeToggle />
            {/* Desktop Navigation */}
            <nav className="hidden items-center md:flex">
              <Button variant="secondary" asChild>
                <Link href="/tool" onClick={handleCtaClick}>
                  Sign In
                </Link>
              </Button>
            </nav>
            {/* Mobile Navigation */}
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu />
                    <span className="sr-only">Open Menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/tool" onClick={handleCtaClick}>
                      Sign In
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="hidden">
                    <Link href="/tool" onClick={handleCtaClick}>
                      Try Demo
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="container py-28 text-center sm:py-36 md:py-52">
          <div className="mx-auto max-w-3xl">
            <div className="mb-4 flex justify-center">
              <div className="relative flex items-center gap-2 rounded-full border px-4 py-1 text-sm leading-6 text-muted-foreground transition-all hover:scale-105 hover:shadow-md">
                <Zap className="h-4 w-4 text-primary" />
                <span>AI Powered Outreach</span>
              </div>
            </div>
            <h1 className="font-headline text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              Turn Cold Leads into Warm Conversations
            </h1>
            <p className="mt-4 text-base text-muted-foreground md:text-lg">
              CortexReach is your intelligent co pilot for high impact cold
              outreach. Our unified AI powered composer helps you research
              prospects, draft hyper personalized emails, and analyze their
              effectiveness all in one seamless workflow.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/tool" onClick={handleCtaClick}>
                  <Zap className="mr-2" /> Get Started
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="features" className="py-20 md:py-28">
          <div className="container">
            <div className="text-center">
              <h2 className="font-headline text-3xl font-bold md:text-4xl">
                A Smarter Way to Do Outreach
              </h2>
              <p className="mt-4 mx-auto max-w-2xl text-lg text-muted-foreground">
                Stop juggling tools. CortexReach unifies every step of the cold
                email process, from research to analysis, into one intelligent
                platform.
              </p>
            </div>
            <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <BrainCircuit className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Instant Prospect Insights</h3>
                <p className="mt-2 text-muted-foreground">
                  Paste a prospect's bio, article, or social media profile and
                  instantly get actionable talking points for your outreach.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Pen className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">AI Powered Email Drafting</h3>
                <p className="mt-2 text-muted-foreground">
                  Generate hyper personalized, high converting email drafts in
                  seconds using the insights gathered by the AI.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Radar className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Effectiveness Analysis</h3>
                <p className="mt-2 text-muted-foreground">
                  Before you send, get an AI powered score and actionable
                  suggestions to improve your email's open and reply rates.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          id="problem"
          className="py-20 md:py-28 dark:bg-[#676768] bg-black"
        >
          <div className="container text-center">
            <h2 className="font-headline text-3xl font-bold md:text-4xl text-white">
              The Outreach Challenge
            </h2>
            <p className="mt-4 mx-auto max-w-2xl text-lg text-white">
              Crafting personalized, effective cold emails at scale is a time
              consuming nightmare. Juggling research, writing, and analysis
              across different tools leads to wasted effort, missed
              opportunities, and outreach that lands in spam or is simply
              ignored.
            </p>
          </div>
        </section>

        <section id="solution" className="py-20 md:py-28">
          <div className="container text-center">
            <h2 className="font-headline text-3xl font-bold md:text-4xl">
              The All in One Solution
            </h2>
            <p className="mt-4 mx-auto max-w-2xl text-lg text-muted-foreground">
              CortexReach consolidates your entire outreach process. Our AI
              powered composer lets you paste in raw prospect data to generate
              key talking points, instantly draft a hyper personalized email
              based on those insights, and then score its effectiveness before
              you even click send.
            </p>
          </div>
        </section>

        <section
          id="result"
          className="py-20 md:py-28 dark:bg-[#676768] bg-black"
        >
          <div className="container text-center">
            <h2 className="font-headline text-3xl font-bold md:text-4xl text-white">
              Proven Results
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-200">
              After launching, our initial{" "}
              <span className="font-bold text-white">25 beta users</span>{" "}
              reported an astounding{" "}
              <span className="font-bold text-white">
                3x increase in reply rates
              </span>{" "}
              within the first month. This powerful validation and positive
              feedback fueled significant investor interest for our next funding
              round.
            </p>
          </div>
        </section>

        <section className="py-20 md:py-32">
          <div className="container text-center">
            <h2 className="font-headline text-3xl font-bold tracking-tight md:text-5xl">
              Ready to Revolutionize Your Outreach?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
              Experience the future of cold emailing. Try our interactive demo
              and see how our unified AI composer can transform your results
              today.
            </p>
            <div className="mt-8">
              <Button size="lg" asChild>
                <Link href="/tool" onClick={handleCtaClick}>
                  Get Started for Free <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
