import { Hero } from "@/components/sections/Hero";
import { NoticeBar } from "@/components/sections/NoticeBar";
import { About } from "@/components/sections/About";
import { PainPoints } from "@/components/sections/PainPoints";
import { AnalyzeCTA } from "@/components/sections/AnalyzeCTA";
import { Solution } from "@/components/sections/Solution";
import { ContentShowcase } from "@/components/sections/ContentShowcase";
import { ColumnsPreview } from "@/components/sections/ColumnsPreview";
import { Services } from "@/components/sections/Services";
import { FinalCTA } from "@/components/sections/FinalCTA";

export default function HomePage() {
  return (
    <main className="flex-1">
      <Hero />
      <NoticeBar />
      <ContentShowcase />
      <About />
      <PainPoints />
      <AnalyzeCTA />
      <Solution />
      <ColumnsPreview />
      <Services />
      <FinalCTA />
    </main>
  );
}
