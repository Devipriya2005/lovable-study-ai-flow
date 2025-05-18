
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb } from 'lucide-react';

const studyTips = [
  {
    title: "The Pomodoro Technique",
    description: "Study for 25 minutes, then take a 5-minute break. After 4 cycles, take a longer 15-30 minute break."
  },
  {
    title: "Active Recall",
    description: "Test yourself on the material instead of passively rereading. Create flashcards or practice questions."
  },
  {
    title: "Spaced Repetition",
    description: "Review material at increasing intervals to improve long-term retention."
  },
  {
    title: "Change Your Environment",
    description: "Switching study locations can help improve memory and concentration."
  },
  {
    title: "Teach What You Learn",
    description: "Explaining concepts to others helps solidify your understanding."
  },
  {
    title: "Use Multiple Resources",
    description: "Learning the same concept from different sources enhances understanding."
  },
  {
    title: "Create Mind Maps",
    description: "Visual organization of information helps with memory and connections."
  },
  {
    title: "Take Effective Notes",
    description: "Use the Cornell method or other structured note-taking systems."
  }
];

export function StudyTips() {
  const [currentTip, setCurrentTip] = useState(0);

  const getNextTip = () => {
    setCurrentTip((prev) => (prev + 1) % studyTips.length);
  };

  return (
    <Card className="bg-study-100 dark:bg-study-900/20 border-study-200">
      <CardHeader className="pb-2">
        <div className="flex items-center space-x-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          <CardTitle className="text-lg">Study Tip</CardTitle>
        </div>
        <CardDescription>Improve your study effectiveness</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h3 className="font-medium">{studyTips[currentTip].title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{studyTips[currentTip].description}</p>
        </div>
        <Button variant="outline" size="sm" onClick={getNextTip}>
          Next Tip
        </Button>
      </CardContent>
    </Card>
  );
}
