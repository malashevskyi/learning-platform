import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { BookOpen, CheckCircle } from "lucide-react";
import { useTranslations } from "next-intl";

export interface CourseCardProps {
  title: string;
  description: string;
  imageSrc: string;
  lessonsCount: number;
  progress?: number;
  category?: string;
  onClick?: () => void;
  className?: string;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  title,
  description,
  imageSrc,
  lessonsCount,
  progress = 0,
  category,
  onClick,
  className,
}) => {
  const t = useTranslations("course");
  const isCompleted = progress === 100;
  const isStarted = progress > 0 && progress < 100;

  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-[15px] border border-border bg-card text-card-foreground shadow-soft transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {/* Image Container */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
        <img
          src={imageSrc}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Category Badge */}
        {category && (
          <div className="absolute left-4 top-4 rounded-md bg-white/90 px-2 py-1 text-xs font-bold text-primary backdrop-blur-sm shadow-sm">
            {category}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          <BookOpen className="w-3.5 h-3.5" />
          <span>{t("lessons", { count: lessonsCount })}</span>
        </div>

        <h3 className="mb-2 font-rubik text-xl font-bold leading-tight group-hover:text-primary transition-colors">
          {title}
        </h3>

        <p className="mb-6 line-clamp-2 text-sm text-muted-foreground">
          {description}
        </p>

        {/* Footer: Progress & Action */}
        <div className="mt-auto flex items-center justify-between gap-4">
          {isStarted ? (
            <div className="flex-1">
              <div className="mb-1 flex justify-between text-xs font-medium">
                <span className="text-primary">{progress}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary/20">
                <div
                  className="h-full bg-primary transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : isCompleted ? (
            <div className="flex items-center gap-2 text-sm font-bold text-green-600">
              <CheckCircle className="w-5 h-5" />
              {t("completed")}
            </div>
          ) : (
            <div className="flex-1" />
          )}

          {isStarted && <Button>{t("continue")}</Button>}
          {!isStarted && !isCompleted && <Button>{t("start")}</Button>}
          {isCompleted && <Button>{t("open")}</Button>}
        </div>
      </div>
    </div>
  );
};
