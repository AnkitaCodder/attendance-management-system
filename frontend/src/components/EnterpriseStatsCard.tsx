import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface EnterpriseStatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
    period?: string;
  };
  description?: string;
  variant?: 'default' | 'primary' | 'success' | 'warning';
  loading?: boolean;
}

export const EnterpriseStatsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  description,
  variant = 'default',
  loading = false
}: EnterpriseStatsCardProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-primary text-white shadow-elevated';
      case 'success':
        return 'bg-gradient-to-br from-success to-success/80 text-white shadow-lg';
      case 'warning':
        return 'bg-gradient-to-br from-warning to-warning/80 text-white shadow-lg';
      default:
        return 'bg-gradient-surface shadow-lg border border-border/50';
    }
  };

  const getTextStyles = () => {
    return variant === 'default' 
      ? 'text-foreground' 
      : 'text-white';
  };

  const getMutedTextStyles = () => {
    return variant === 'default' 
      ? 'text-muted-foreground' 
      : 'text-white/70';
  };

  if (loading) {
    return (
      <Card className={`p-6 transition-all duration-300 hover:shadow-xl ${getVariantStyles()}`}>
        <div className="animate-pulse">
          <div className="flex items-center justify-between">
            <div className="space-y-3">
              <div className="h-4 bg-muted/30 rounded w-24"></div>
              <div className="h-8 bg-muted/30 rounded w-16"></div>
              <div className="h-3 bg-muted/20 rounded w-32"></div>
            </div>
            <div className="p-3 bg-muted/20 rounded-xl">
              <div className="h-6 w-6 bg-muted/30 rounded"></div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`
      p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 
      ${getVariantStyles()} interactive-sm group
    `}>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className={`text-sm font-medium ${getMutedTextStyles()}`}>
            {title}
          </p>
          <p className={`text-3xl font-bold ${getTextStyles()} group-hover:scale-105 transition-transform duration-200`}>
            {value}
          </p>
          {description && (
            <p className={`text-sm ${getMutedTextStyles()}`}>
              {description}
            </p>
          )}
          {trend && (
            <div className={`flex items-center gap-1 text-sm font-medium ${
              variant === 'default' 
                ? (trend.isPositive ? 'text-success' : 'text-destructive')
                : 'text-white'
            }`}>
              {trend.isPositive ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span>{trend.isPositive ? '+' : ''}{trend.value}%</span>
              <span className={`ml-1 ${getMutedTextStyles()}`}>
                {trend.period || 'vs last week'}
              </span>
            </div>
          )}
        </div>
        <div className={`
          p-4 rounded-2xl transition-all duration-300 group-hover:scale-110
          ${variant === 'default' 
            ? 'bg-gradient-primary shadow-elevated' 
            : 'bg-white/20 shadow-lg'
          }
        `}>
          <Icon className={`h-7 w-7 ${
            variant === 'default' ? 'text-white' : 'text-white'
          }`} />
        </div>
      </div>
    </Card>
  );
};