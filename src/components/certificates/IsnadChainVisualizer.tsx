import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Award,
  Link as LinkIcon,
  ChevronDown,
  ChevronUp,
  BookOpen,
  MapPin,
  Calendar,
  ExternalLink,
  Shield,
  Sparkles,
  User,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";

// Isnad link in the chain
export interface IsnadLink {
  id: string;
  name: string;
  arabicName?: string;
  title?: string; // e.g., "Sheikh", "Maulana", "Ustadh"
  generation: number; // 1 = student's direct teacher, higher = further back
  location?: string;
  era?: string; // e.g., "Contemporary", "19th Century", "8th Century"
  specialization?: string;
  bio?: string;
  imageUrl?: string;
  isVerified: boolean;
  isHistorical: boolean; // True for scholars from history
  verificationSource?: string;
}

// The ijazah/certificate
export interface IjazahCertificate {
  id: string;
  type: "quran_memorization" | "quran_recitation" | "hadith" | "fiqh" | "general_ijazah";
  title: string;
  arabicTitle?: string;
  description: string;
  issuedDate: string;
  issuedBy: string; // Institution or teacher name
  chain: IsnadLink[];
  studentId: string;
  studentName: string;
  verificationUrl?: string;
  certificateImageUrl?: string;
}

interface IsnadChainVisualizerProps {
  certificate: IjazahCertificate;
  variant?: "full" | "compact" | "inline";
  showCertificate?: boolean;
}

const TYPE_LABELS: Record<IjazahCertificate["type"], { label: string; icon: string; color: string }> = {
  quran_memorization: { label: "Hifz Quran", icon: "📖", color: "bg-emerald-100 text-emerald-800" },
  quran_recitation: { label: "Qira'at", icon: "🎙️", color: "bg-blue-100 text-blue-800" },
  hadith: { label: "Hadith Sciences", icon: "📚", color: "bg-amber-100 text-amber-800" },
  fiqh: { label: "Islamic Jurisprudence", icon: "⚖️", color: "bg-purple-100 text-purple-800" },
  general_ijazah: { label: "General Ijazah", icon: "🎓", color: "bg-gray-100 text-gray-800" },
};

// Chain link component
function ChainLink({
  link,
  isFirst,
  isLast,
  showDetails,
  onToggle,
}: {
  link: IsnadLink;
  isFirst: boolean;
  isLast: boolean;
  showDetails: boolean;
  onToggle: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: link.generation * 0.1 }}
      className="relative"
    >
      {/* Connector line */}
      {!isFirst && (
        <div className="absolute left-6 -top-4 w-0.5 h-4 bg-primary/30" />
      )}
      
      <div
        className={cn(
          "flex items-start gap-4 p-4 rounded-lg border transition-all cursor-pointer",
          showDetails || expanded
            ? "bg-primary/5 border-primary/30"
            : "bg-background hover:bg-muted/50",
          isLast && "border-primary border-2"
        )}
        onClick={() => setExpanded(!expanded)}
      >
        {/* Avatar / Generation indicator */}
        <div className="relative">
          <Avatar className={cn(
            "h-12 w-12 ring-2",
            link.isHistorical ? "ring-amber-300" : "ring-primary/30"
          )}>
            <AvatarImage src={link.imageUrl} />
            <AvatarFallback className={cn(
              link.isHistorical ? "bg-amber-100 text-amber-700" : "bg-primary/10 text-primary"
            )}>
              {link.title ? link.title.charAt(0) : link.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          {/* Generation badge */}
          <Badge
            variant="outline"
            className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px] bg-background"
          >
            {link.generation}
          </Badge>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-semibold">
              {link.title && <span className="text-muted-foreground">{link.title} </span>}
              {link.name}
            </h4>
            {link.isVerified && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Shield className="h-4 w-4 text-primary" />
                  </TooltipTrigger>
                  <TooltipContent>
                    Verified chain link
                    {link.verificationSource && ` (${link.verificationSource})`}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {link.isHistorical && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                Historical
              </Badge>
            )}
            {isLast && (
              <Badge className="text-[10px] px-1.5 py-0 bg-amber-500">
                <Sparkles className="h-3 w-3 mr-1" />
                Origin
              </Badge>
            )}
          </div>
          
          {link.arabicName && (
            <p className="text-sm text-muted-foreground font-arabic" dir="rtl">
              {link.arabicName}
            </p>
          )}
          
          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
            {link.era && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {link.era}
              </span>
            )}
            {link.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {link.location}
              </span>
            )}
            {link.specialization && (
              <span className="flex items-center gap-1">
                <BookOpen className="h-3 w-3" />
                {link.specialization}
              </span>
            )}
          </div>

          {/* Expanded bio */}
          <AnimatePresence>
            {expanded && link.bio && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <p className="mt-3 text-sm text-muted-foreground border-t pt-3">
                  {link.bio}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Expand indicator */}
        {link.bio && (
          <div className="shrink-0">
            {expanded ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        )}
      </div>

      {/* Connector line to next */}
      {!isLast && (
        <div className="flex justify-center py-1">
          <div className="w-0.5 h-4 bg-primary/30" />
          <LinkIcon className="h-4 w-4 text-primary/50 absolute" />
        </div>
      )}
    </motion.div>
  );
}

export function IsnadChainVisualizer({
  certificate,
  variant = "full",
  showCertificate = true,
}: IsnadChainVisualizerProps) {
  const [showFullChain, setShowFullChain] = useState(false);
  const [selectedLink, setSelectedLink] = useState<string | null>(null);

  const typeInfo = TYPE_LABELS[certificate.type];
  const sortedChain = [...certificate.chain].sort((a, b) => a.generation - b.generation);
  
  // Show first 3 links in compact mode
  const visibleChain = variant === "compact" && !showFullChain
    ? sortedChain.slice(0, 3)
    : sortedChain;
  const hasMoreLinks = sortedChain.length > 3;

  if (variant === "inline") {
    // Super compact inline view
    return (
      <div className="flex items-center gap-2">
        <Award className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium">{certificate.title}</span>
        <span className="text-xs text-muted-foreground">
          ({sortedChain.length}-link chain)
        </span>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
              <Info className="h-3 w-3 mr-1" />
              View Chain
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                {certificate.title}
              </DialogTitle>
              <DialogDescription>
                Isnad chain of transmission
              </DialogDescription>
            </DialogHeader>
            <IsnadChainVisualizer certificate={certificate} variant="full" showCertificate={false} />
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <Card className="overflow-hidden">
      {/* Certificate Header */}
      {showCertificate && (
        <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className={cn("text-sm", typeInfo.color)}>
                  {typeInfo.icon} {typeInfo.label}
                </Badge>
                {certificate.verificationUrl && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <a
                          href={certificate.verificationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </TooltipTrigger>
                      <TooltipContent>Verify this certificate</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              <CardTitle className="text-xl">{certificate.title}</CardTitle>
              {certificate.arabicTitle && (
                <p className="font-arabic text-lg text-muted-foreground" dir="rtl">
                  {certificate.arabicTitle}
                </p>
              )}
            </div>
            <Award className="h-12 w-12 text-primary/30" />
          </div>
          
          <p className="text-sm text-muted-foreground mt-2">
            {certificate.description}
          </p>
          
          <div className="flex items-center gap-4 mt-4 text-sm">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>Issued to: <strong>{certificate.studentName}</strong></span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{new Date(certificate.issuedDate).toLocaleDateString()}</span>
            </div>
          </div>
        </CardHeader>
      )}

      <CardContent className={cn(showCertificate ? "pt-6" : "pt-4")}>
        {/* Chain Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <LinkIcon className="h-4 w-4 text-primary" />
            Chain of Transmission (Isnad)
          </h3>
          <Badge variant="outline">
            {sortedChain.length} {sortedChain.length === 1 ? "link" : "links"}
          </Badge>
        </div>

        {/* Visual explanation */}
        <div className="bg-muted/50 rounded-lg p-3 mb-4 text-sm text-muted-foreground">
          <p>
            The isnad traces the chain of teachers through whom this knowledge was transmitted,
            connecting you to the original source of Islamic scholarship.
          </p>
        </div>

        {/* The Chain */}
        <div className="space-y-2">
          {visibleChain.map((link, index) => (
            <ChainLink
              key={link.id}
              link={link}
              isFirst={index === 0}
              isLast={index === visibleChain.length - 1 && !hasMoreLinks}
              showDetails={selectedLink === link.id}
              onToggle={() => setSelectedLink(selectedLink === link.id ? null : link.id)}
            />
          ))}
          
          {/* Show more button */}
          {variant === "compact" && hasMoreLinks && !showFullChain && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowFullChain(true)}
            >
              <ChevronDown className="h-4 w-4 mr-2" />
              Show {sortedChain.length - 3} more links in chain
            </Button>
          )}
          
          {showFullChain && hasMoreLinks && (
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => setShowFullChain(false)}
            >
              <ChevronUp className="h-4 w-4 mr-2" />
              Collapse
            </Button>
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Shield className="h-3 w-3 text-primary" />
            <span>Verified</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-amber-100 ring-1 ring-amber-300" />
            <span>Historical Figure</span>
          </div>
          <div className="flex items-center gap-1">
            <Badge className="text-[8px] px-1 py-0 bg-amber-500">Origin</Badge>
            <span>Source of Chain</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Sample data for demonstration
export const SAMPLE_ISNAD: IjazahCertificate = {
  id: "cert-001",
  type: "quran_memorization",
  title: "Ijazah in Quran Memorization (Hifz)",
  arabicTitle: "إجازة في حفظ القرآن الكريم",
  description: "This certificate attests to the complete memorization of the Holy Quran with connected chain (isnad) to the Prophet Muhammad ﷺ",
  issuedDate: "2024-06-15",
  issuedBy: "Dar al-Quran Institute",
  studentId: "student-001",
  studentName: "Ahmad Abdullah",
  verificationUrl: "https://verify.example.com/cert/001",
  chain: [
    {
      id: "l1",
      name: "Sheikh Muhammad Al-Azhari",
      arabicName: "الشيخ محمد الأزهري",
      title: "Sheikh",
      generation: 1,
      location: "Cairo, Egypt",
      era: "Contemporary",
      specialization: "Quran & Tajweed",
      isVerified: true,
      isHistorical: false,
      bio: "Senior Quran instructor at Al-Azhar University with over 30 years of teaching experience.",
    },
    {
      id: "l2",
      name: "Sheikh Abdul Rahman Al-Sudais",
      arabicName: "الشيخ عبد الرحمن السديس",
      title: "Sheikh",
      generation: 2,
      location: "Makkah, Saudi Arabia",
      era: "Contemporary",
      specialization: "Qira'at",
      isVerified: true,
      isHistorical: false,
    },
    {
      id: "l3",
      name: "Sheikh Muhammad Al-Zarqani",
      arabicName: "الشيخ محمد الزرقاني",
      title: "Sheikh",
      generation: 3,
      location: "Egypt",
      era: "20th Century",
      specialization: "Quran Sciences",
      isVerified: true,
      isHistorical: true,
    },
    {
      id: "l4",
      name: "Imam Ibn al-Jazari",
      arabicName: "الإمام ابن الجزري",
      title: "Imam",
      generation: 4,
      location: "Damascus",
      era: "14th Century",
      specialization: "Qira'at & Tajweed",
      isVerified: true,
      isHistorical: true,
      bio: "The most famous scholar of Quranic recitation, author of 'Al-Jazariyyah' - the foundational text of Tajweed.",
    },
  ],
};

export default IsnadChainVisualizer;
