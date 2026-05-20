import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/Badge";
import { Card } from "@/components/Card";
import { Disclaimer } from "@/components/Disclaimer";
import { SectionHeader } from "@/components/SectionHeader";
import { learningModules } from "@/data/mockMarket";

export default function LearningPage() {
  return (
    <AppShell>
      <SectionHeader
        eyebrow="Learning center"
        title="Financial education pathway placeholder"
        description="Learning modules frame the same market tools for undergraduate, graduate, and professional audiences."
      />
      <div className="mb-5">
        <Disclaimer />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {learningModules.map((module) => (
          <Card key={module.title}>
            <Badge tone={module.audience === "Undergraduate" ? "teal" : module.audience === "Graduate" ? "amber" : "slate"}>
              {module.audience}
            </Badge>
            <h2 className="mt-4 text-xl font-black">{module.title}</h2>
            <p className="mt-2 text-sm font-extrabold text-muted">{module.duration}</p>
            <p className="mt-4 text-sm leading-6 text-muted">{module.goal}</p>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
