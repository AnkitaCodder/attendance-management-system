import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
}

export const StatsCard = ({ title, value, icon: Icon, trend, description }: StatsCardProps) => {
  return (
    <Card className="p-6 bg-gradient-card shadow-card border-0 hover:shadow-elegant transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
          {trend && (
            <div className={`flex items-center text-sm ${
              trend.isPositive ? 'text-success' : 'text-destructive'
            }`}>
              <span>{trend.isPositive ? '+' : ''}{trend.value}%</span>
              <span className="ml-1 text-muted-foreground">vs yesterday</span>
            </div>
          )}
        </div>
        <div className="p-3 bg-gradient-primary rounded-xl shadow-elegant">
          <Icon className="h-6 w-6 text-primary-foreground" />
        </div>
      </div>
    </Card>
  );
};