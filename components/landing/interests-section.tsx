import {
  BookOpen,
  Briefcase,
  Camera,
  Globe,
  Heart,
  Home,
  Leaf,
  Mountain,
  Music,
  Palette,
  Plane,
  Trophy,
  Utensils,
  Wine,
  Bike,
  Dumbbell,
  Film,
  Gamepad2,
  Sailboat,
  Dog,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  book: BookOpen,
  briefcase: Briefcase,
  camera: Camera,
  globe: Globe,
  heart: Heart,
  home: Home,
  leaf: Leaf,
  mountain: Mountain,
  music: Music,
  palette: Palette,
  plane: Plane,
  trophy: Trophy,
  utensils: Utensils,
  wine: Wine,
  bike: Bike,
  dumbbell: Dumbbell,
  film: Film,
  gamepad: Gamepad2,
  sailboat: Sailboat,
  dog: Dog,
};

interface Interest {
  name: string;
  icon?: string;
}

interface InterestsData {
  title?: string;
  interests: Interest[];
}

interface InterestsSectionProps {
  interestsData: InterestsData;
}

export function InterestsSection({ interestsData }: InterestsSectionProps) {
  const { interests } = interestsData;

  if (!interests || interests.length === 0) {
    return null;
  }

  const title = interestsData.title ?? "Interessi";

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-10 text-center text-2xl font-bold text-foreground sm:text-3xl">
          {title}
        </h2>

        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {interests.map((interest, index) => {
            const IconComponent = getIconForInterest(interest.icon);

            return (
              <div
                key={index}
                className="flex flex-col items-center gap-3 rounded-lg p-4 transition-colors hover:bg-muted"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <IconComponent className="h-6 w-6 text-primary" />
                </div>
                <span className="text-center text-sm font-medium text-foreground">
                  {interest.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function getIconForInterest(iconName?: string): LucideIcon {
  if (!iconName) return Heart;
  return ICON_MAP[iconName.toLowerCase()] ?? Heart;
}
