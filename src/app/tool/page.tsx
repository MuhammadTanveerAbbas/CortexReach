
'use client';

import { useState, useTransition, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Loader,
  Pen,
  Copy,
  Radar,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Sparkles,
  User,
  MailOpen,
  MousePointerClick,
  Target,
  Lightbulb,
  TrendingUp,
  Award,
} from 'lucide-react';
import { generatePersonalizedEmails } from '@/ai/flows/generate-personalized-emails';
import {
  rateEmailEffectiveness,
  RateEmailEffectivenessOutput,
} from '@/ai/flows/rate-email-effectiveness';
import { summarizeProspectInsights } from '@/ai/flows/summarize-prospect-insights';
import { useToast } from '@/hooks/use-toast';

const suggestionIcons = [Lightbulb, TrendingUp, Award];

const demoProspects = [
  {
    details: `Sarah Chen is the VP of Marketing at InnovateTech, a fast growing SaaS company in the AI space. She recently wrote a blog post titled "The Future of AI in Marketing Automation" where she emphasized the need for more personalized and human like customer interactions. She's active on LinkedIn, often sharing insights about marketing trends and leadership. In her bio, she mentions being passionate about mentorship and sustainable tech.`,
    name: 'Sarah Chen',
    company: 'InnovateTech',
    title: 'VP of Marketing',
  },
  {
    details: `Alex Rodriguez is the Head of Growth at QuantumLeap, a startup focused on predictive analytics. He was recently featured on a podcast discussing the challenges of scaling data infrastructure. He's a known advocate for using data driven strategies to achieve product market fit. His company, QuantumLeap, just secured Series A funding to expand their engineering team.`,
    name: 'Alex Rodriguez',
    company: 'QuantumLeap',
    title: 'Head of Growth',
  },
  {
    details: `Dr. Emily Carter is the Chief Technology Officer at BioGenetics Inc., a leading firm in genomic research. She published a paper on CRISPR technology's impact on modern medicine. Her work is highly respected in the academic community, and she often speaks at biotech conferences. She is looking for ways to accelerate their research data processing pipeline.`,
    name: 'Dr. Emily Carter',
    company: 'BioGenetics Inc.',
    title: 'CTO',
  },
  {
    details: `Michael B. Jordan is a Senior Sales Director at Nexus Solutions, a company that provides cybersecurity solutions to financial institutions. He posted on LinkedIn about the rising threat of phishing attacks in the banking sector. He's looking for innovative ways to protect his clients and has shown interest in AI driven security platforms.`,
    name: 'Michael B. Jordan',
    company: 'Nexus Solutions',
    title: 'Senior Sales Director',
  },
];

export default function ComposerPage() {
  const [isGenerating, startGenerating] = useTransition();
  const [isAnalyzing, startAnalyzing] = useTransition();
  const [isLoadingDemo, startLoadingDemo] = useTransition();
  const { toast } = useToast();

  // State for Prospect
  const [prospectDetails, setProspectDetails] = useState('');
  const [prospectName, setProspectName] = useState('');
  const [prospectCompany, setProspectCompany] = useState('');
  const [prospectJobTitle, setProspectJobTitle] = useState('');
  
  // State for Email Composer
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const editorRef = useRef<HTMLDivElement>(null);

  // State for Email Rater
  const [effectivenessResult, setEffectivenessResult] =
    useState<RateEmailEffectivenessOutput | null>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== body) {
      editorRef.current.innerHTML = body;
    }
  }, [body]);

  const handleBodyChange = (e: React.FormEvent<HTMLDivElement>) => {
    setBody(e.currentTarget.innerHTML);
  };

  const handleFormat = (command: string) => {
    if (editorRef.current) {
        document.execCommand(command, false, undefined);
        editorRef.current.focus();
        setBody(editorRef.current.innerHTML);
    }
  };

  const handleGenerateEmail = () => {
     if (!prospectDetails) {
      toast({
        variant: 'destructive',
        title: 'No Details Provided',
        description: 'Please paste some details about the prospect to generate an email.',
      });
      return;
    }
    startGenerating(async () => {
      try {
        setSubject('');
        setBody('');
        setEffectivenessResult(null);

        const summaryResult = await summarizeProspectInsights({ prospectDetails });
        
        const emailResult = await generatePersonalizedEmails({
          prospectName,
          prospectCompany,
          prospectJobTitle,
          emailContext: summaryResult.summary,
        });
        setSubject(emailResult.subjectLine);
        setBody(emailResult.body);

        toast({
          title: 'Email Generated',
          description: 'Your personalized email draft is ready.',
        });

      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Generation Failed',
          description: 'The AI service is currently unavailable. Please try again later.',
        });
      }
    });
  };

  const handleAnalyzeEmail = () => {
    if (!body) {
      toast({
        variant: 'destructive',
        title: 'Empty Email',
        description: 'Please write or generate an email before analyzing it.',
      });
      return;
    }
    startAnalyzing(async () => {
      try {
        setEffectivenessResult(null);
        const result = await rateEmailEffectiveness({
          emailContent: `Subject: ${subject}\n\n${body.replace(/<[^>]*>/g, '')}`,
          targetAudience: prospectJobTitle,
          goal: 'Get a reply',
        });
        setEffectivenessResult(result);
        toast({
          title: 'Analysis Complete',
          description: "Your email's effectiveness has been rated.",
        });
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Analysis Failed',
          description: 'The AI service is currently unavailable. Please try again later.',
        });
      }
    });
  };

  const handleCopyEmail = () => {
    if (!subject && !body) {
      toast({
        variant: 'destructive',
        title: 'Nothing to Copy',
        description: 'Please generate or write an email first.',
      });
      return;
    }
    const plainTextBody = body.replace(/<[^>]*>/g, '\n');
    navigator.clipboard.writeText(`Subject: ${subject}\n\n${plainTextBody}`);
    toast({
      title: 'Email Copied',
      description: 'The subject and body have been copied as plain text.',
    });
  };

  const handleDemoClick = () => {
    startLoadingDemo(async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      const randomProspect = demoProspects[Math.floor(Math.random() * demoProspects.length)];
      setProspectDetails(randomProspect.details);
      setProspectName(randomProspect.name);
      setProspectCompany(randomProspect.company);
      setProspectJobTitle(randomProspect.title);
      toast({
        title: 'Demo Content Loaded',
        description: 'Click "Generate Email" to see the AI in action.',
      });
    });
  };

  const isPending = isGenerating || isAnalyzing || isLoadingDemo;

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        {/* Column 1: Prospect Intel & Details */}
        <Card className="flex flex-col lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-6 w-6" />
              Prospect Information
            </CardTitle>
            <CardDescription>
              Add details, then click 'Generate Email'.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col flex-1 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="prospect-details">Prospect Background (Bio, articles, posts)</Label>
              <Textarea
                id="prospect-details"
                placeholder="Paste prospect information here..."
                className="resize-none"
                value={prospectDetails}
                onChange={(e) => setProspectDetails(e.target.value)}
              />
            </div>
            <div className="space-y-2">
                <Label htmlFor="prospect-name">Prospect Name</Label>
                <Input id="prospect-name" value={prospectName} onChange={(e) => setProspectName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prospect-company">Prospect Company</Label>
                <Input id="prospect-company" value={prospectCompany} onChange={(e) => setProspectCompany(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prospect-title">Prospect Job Title</Label>
                <Input id="prospect-title" value={prospectJobTitle} onChange={(e) => setProspectJobTitle(e.target.value)} />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" className="flex-1" onClick={handleGenerateEmail} disabled={isPending}>
                  {isGenerating ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                  Generate Email
                </Button>
                <Button size="sm" variant="outline" className="flex-1" onClick={handleDemoClick} disabled={isPending}>
                  {isLoadingDemo ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : 'Demo'}
                </Button>
              </div>
          </CardContent>
        </Card>

        {/* Column 2: Email Composer */}
        <Card className="flex flex-col flex-1 lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pen className="h-6 w-6" />
              Email Composer
            </CardTitle>
            <CardDescription>
              Review, edit, and analyze your AI generated email draft.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" placeholder="Your email subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
            </div>
            <div className="space-y-2 flex-1 flex flex-col">
              <Label>Body</Label>
              <div className="rounded-md border border-input flex-1 flex flex-col focus-within:ring-2 focus-within:ring-white">
                <div className="flex items-center gap-1 border-b p-1">
                  <Button variant="ghost" size="icon" onMouseDown={(e) => { e.preventDefault(); handleFormat('bold'); }}><Bold className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onMouseDown={(e) => { e.preventDefault(); handleFormat('italic'); }}><Italic className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onMouseDown={(e) => { e.preventDefault(); handleFormat('underline'); }}><Underline className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onMouseDown={(e) => { e.preventDefault(); handleFormat('insertUnorderedList'); }}><List className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onMouseDown={(e) => { e.preventDefault(); handleFormat('insertOrderedList'); }}><ListOrdered className="h-4 w-4" /></Button>
                </div>
                <div
                  ref={editorRef}
                  contentEditable
                  onInput={handleBodyChange}
                  className="p-4 text-base ring-offset-background focus-visible:outline-none md:text-sm h-48 overflow-y-auto"
                />
              </div>
            </div>
            <div className="flex flex-nowrap gap-2">
              <Button size="sm" className="flex-1" onClick={handleAnalyzeEmail} disabled={isPending}>
                {isAnalyzing ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <Radar className="mr-2 h-4 w-4" />}
                Analyze Email
              </Button>
              <Button size="sm" className="flex-1" onClick={handleCopyEmail} variant="outline">
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {(isAnalyzing || effectivenessResult) && (
        <Card>
          <CardHeader>
            <CardTitle>Effectiveness Analysis</CardTitle>
             <CardDescription>
              AI powered predictions and suggestions to improve your email's impact.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isAnalyzing && (
              <div className="space-y-4">
                <div className="h-8 bg-muted rounded animate-pulse w-1/4"></div>
                <div className="h-24 bg-muted rounded animate-pulse"></div>
                <div className="h-8 bg-muted rounded animate-pulse w-1/3 mt-4"></div>
                <div className="h-32 bg-muted rounded animate-pulse"></div>
              </div>
            )}
            {effectivenessResult && (
               <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Effectiveness Score</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <div className="relative h-32 w-32 mx-auto">
                        <svg className="w-full h-full" viewBox="0 0 36 36">
                          <path
                            className="text-muted/50"
                            d="M18 2.0845
                              a 15.9155 15.9155 0 0 1 0 31.831
                              a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                          />
                          <path
                            className="text-primary"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeDasharray={`${effectivenessResult.effectivenessScore}, 100`}
                            d="M18 2.0845
                              a 15.9155 15.9155 0 0 1 0 31.831
                              a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                           <span className="text-3xl font-bold">{effectivenessResult.effectivenessScore}</span>
                        </div>
                      </div>
                       <p className="text-muted-foreground text-sm mt-2">out of 100</p>
                    </CardContent>
                  </Card>
                  <Card>
                     <CardHeader>
                        <CardTitle className="text-lg">Engagement Predictions</CardTitle>
                      </CardHeader>
                      <CardContent className="flex flex-col sm:flex-row justify-around gap-4 text-center">
                        <div className="flex flex-col items-center space-y-2">
                          <div className="p-3 bg-primary/10 rounded-full">
                            <MailOpen className="h-6 w-6 text-primary" />
                          </div>
                          <div className='flex flex-col items-center'>
                             <p className="text-2xl font-bold">{effectivenessResult.engagementPredictions.openRate.toFixed(1)}%</p>
                            <p className="text-sm text-muted-foreground">Open Rate</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-center space-y-2">
                          <div className="p-3 bg-primary/10 rounded-full">
                            <MousePointerClick className="h-6 w-6 text-primary" />
                          </div>
                           <div className='flex flex-col items-center'>
                            <p className="text-2xl font-bold">{effectivenessResult.engagementPredictions.clickThroughRate.toFixed(1)}%</p>
                            <p className="text-sm text-muted-foreground">Clickthrough</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-center space-y-2">
                          <div className="p-3 bg-primary/10 rounded-full">
                            <Target className="h-6 w-6 text-primary" />
                          </div>
                           <div className='flex flex-col items-center'>
                            <p className="text-2xl font-bold">{effectivenessResult.engagementPredictions.conversionRate.toFixed(1)}%</p>
                            <p className="text-sm text-muted-foreground">Conversion</p>
                          </div>
                        </div>
                      </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Top Improvement Suggestions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      {effectivenessResult.suggestions.slice(0, 3).map((suggestion, index) => {
                        const Icon = suggestionIcons[index % suggestionIcons.length];
                        return (
                          <li key={index} className="flex items-start gap-3 sm:gap-4">
                            <div className="flex-shrink-0 h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mt-1 sm:mt-0">
                              <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                            </div>
                            <p className="text-sm text-muted-foreground">{suggestion}</p>
                          </li>
                        );
                      })}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
