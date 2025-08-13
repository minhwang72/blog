import Script from 'next/script';

interface HowToStep {
  name: string;
  text: string;
  image?: string;
}

interface HowToSchemaProps {
  title: string;
  description: string;
  steps: HowToStep[];
  totalTime?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
}

export default function HowToSchema({ 
  title, 
  description, 
  steps, 
  totalTime = 'PT30M',
  difficulty = 'Beginner'
}: HowToSchemaProps) {
  if (!steps || steps.length === 0) return null;

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": title,
    "description": description,
    "totalTime": totalTime,
    "difficulty": difficulty,
    "step": steps.map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "name": step.name,
      "text": step.text,
      ...(step.image && { "image": step.image })
    }))
  };

  return (
    <Script
      id="howto-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(howToSchema),
      }}
    />
  );
}
