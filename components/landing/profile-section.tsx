import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Mail,
  Phone,
  Smartphone,
  MapPin,
  Download,
  Award,
  Leaf,
} from "lucide-react";

interface ProfileSectionProps {
  consultant: {
    id: string;
    firstName: string;
    lastName: string;
    title?: string | null;
    role: string;
    network?: string | null;
    profileImage?: string | null;
    email: string;
    phone?: string | null;
    mobile?: string | null;
    address?: string | null;
    cap?: string | null;
    city?: string | null;
    province?: string | null;
    efpa: boolean;
    efpaEsg: boolean;
    sustainableAdvisor: boolean;
  };
}

export function ProfileSection({ consultant }: ProfileSectionProps) {
  const fullName = [consultant.title, consultant.firstName, consultant.lastName]
    .filter(Boolean)
    .join(" ");

  const fullAddress = [
    consultant.address,
    [consultant.cap, consultant.city].filter(Boolean).join(" "),
    consultant.province,
  ]
    .filter(Boolean)
    .join(", ");

  const mapQuery = encodeURIComponent(fullAddress);
  const certifications = buildCertificationsList(consultant);

  return (
    <section id="chi-sono" className="bg-muted py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Card className="overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Photo Column */}
            {consultant.profileImage && (
              <div className="flex items-start justify-center bg-muted p-8 md:w-1/3">
                <div className="relative h-56 w-56 overflow-hidden rounded-xl shadow-lg">
                  <Image
                    src={consultant.profileImage}
                    alt={fullName}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}

            {/* Info Column */}
            <div className="flex-1">
              <CardHeader>
                <CardTitle className="text-2xl">{fullName}</CardTitle>
                <p className="text-base font-medium text-primary">
                  {consultant.role}
                </p>
                {consultant.network && (
                  <p className="text-sm text-muted-foreground">
                    {consultant.network}
                  </p>
                )}
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Contact Info */}
                <div className="space-y-3">
                  <ContactRow
                    icon={<Mail className="h-4 w-4" />}
                    href={`mailto:${consultant.email}`}
                    label={consultant.email}
                  />
                  {consultant.phone && (
                    <ContactRow
                      icon={<Phone className="h-4 w-4" />}
                      href={`tel:${consultant.phone}`}
                      label={consultant.phone}
                    />
                  )}
                  {consultant.mobile && (
                    <ContactRow
                      icon={<Smartphone className="h-4 w-4" />}
                      href={`tel:${consultant.mobile}`}
                      label={consultant.mobile}
                    />
                  )}
                  {fullAddress && (
                    <ContactRow
                      icon={<MapPin className="h-4 w-4" />}
                      href={`https://maps.google.com/?q=${mapQuery}`}
                      label={fullAddress}
                      external
                    />
                  )}
                </div>

                {/* Certifications */}
                {certifications.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {certifications.map((cert) => (
                      <Badge
                        key={cert.label}
                        variant="secondary"
                        className="gap-1.5 px-3 py-1"
                      >
                        {cert.icon}
                        {cert.label}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* VCard Download */}
                <Button variant="outline" size="sm" asChild>
                  <a href={`/api/vcard/${consultant.id}`} download>
                    <Download className="h-4 w-4" />
                    Scarica contatto
                  </a>
                </Button>
              </CardContent>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}

function ContactRow({
  icon,
  href,
  label,
  external = false,
}: {
  icon: React.ReactNode;
  href: string;
  label: string;
  external?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-primary">{icon}</span>
      <a
        href={href}
        className="text-muted-foreground transition-colors hover:text-foreground"
        {...(external
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {label}
      </a>
    </div>
  );
}

function buildCertificationsList(consultant: {
  efpa: boolean;
  efpaEsg: boolean;
  sustainableAdvisor: boolean;
}) {
  const certs: Array<{ label: string; icon: React.ReactNode }> = [];

  if (consultant.efpa) {
    certs.push({
      label: "EFPA",
      icon: <Award className="h-3.5 w-3.5" />,
    });
  }
  if (consultant.efpaEsg) {
    certs.push({
      label: "EFPA ESG Advisor",
      icon: <Leaf className="h-3.5 w-3.5" />,
    });
  }
  if (consultant.sustainableAdvisor) {
    certs.push({
      label: "Sustainable Advisor",
      icon: <Leaf className="h-3.5 w-3.5" />,
    });
  }

  return certs;
}
