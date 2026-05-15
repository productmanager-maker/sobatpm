import {
  Type,
  Hash,
  CircleDot,
  Tags,
  Calendar,
  CheckSquare,
  Link as LinkIcon,
  Mail,
  User,
  Clock,
  UserCircle,
} from "lucide-react";
import type { PropertyType } from "@/lib/database-types";

const ICONS: Record<PropertyType, React.ComponentType<{ className?: string }>> = {
  text: Type,
  number: Hash,
  select: CircleDot,
  multi_select: Tags,
  date: Calendar,
  checkbox: CheckSquare,
  url: LinkIcon,
  email: Mail,
  person: User,
  created_time: Clock,
  created_by: UserCircle,
};

export function PropertyIcon({ type, className }: { type: PropertyType; className?: string }) {
  const Icon = ICONS[type];
  return <Icon className={className ?? "h-3.5 w-3.5"} />;
}
