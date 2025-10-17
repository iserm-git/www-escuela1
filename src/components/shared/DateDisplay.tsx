"use client";

import { Typography, Chip, Stack, Tooltip } from "@mui/material";
import {
  CalendarMonth as CalendarIcon,
  AccessTime as TimeIcon,
} from "@mui/icons-material";

interface DateDisplayProps {
  date: string; // ISO format
  showTime?: boolean;
  format?: "long" | "short" | "relative";
  variant?: "text" | "chip";
  icon?: boolean;
  locale?: string;
}

export function DateDisplay({
  date,
  showTime = false,
  format = "short",
  variant = "text",
  icon = false,
  locale = "es-MX",
}: DateDisplayProps) {
  if (!date) return null;

  const formatDate = (dateString: string): string => {
    const dateObj = new Date(dateString);

    if (format === "relative") {
      return getRelativeTime(dateObj);
    }

    const options: Intl.DateTimeFormatOptions =
      format === "long"
        ? {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }
        : {
            year: "numeric",
            month: "short",
            day: "numeric",
          };

    if (showTime) {
      options.hour = "2-digit";
      options.minute = "2-digit";
    }

    return dateObj.toLocaleDateString(locale, options);
  };

  const getRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Hace unos segundos";
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `Hace ${minutes} minuto${minutes > 1 ? "s" : ""}`;
    }
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `Hace ${hours} hora${hours > 1 ? "s" : ""}`;
    }
    if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return `Hace ${days} día${days > 1 ? "s" : ""}`;
    }

    return formatDate(date.toISOString());
  };

  const formattedDate = formatDate(date);
  const fullDate = new Date(date).toLocaleString(locale);

  if (variant === "chip") {
    return (
      <Tooltip title={fullDate}>
        <Chip
          icon={icon ? <CalendarIcon fontSize="small" /> : undefined}
          label={formattedDate}
          size="small"
          variant="outlined"
        />
      </Tooltip>
    );
  }

  if (icon) {
    return (
      <Tooltip title={fullDate}>
        <Stack direction="row" spacing={0.5} alignItems="center">
          {showTime ? (
            <TimeIcon fontSize="small" color="action" />
          ) : (
            <CalendarIcon fontSize="small" color="action" />
          )}
          <Typography variant="body2">{formattedDate}</Typography>
        </Stack>
      </Tooltip>
    );
  }

  return (
    <Tooltip title={fullDate}>
      <Typography variant="body2">{formattedDate}</Typography>
    </Tooltip>
  );
}
