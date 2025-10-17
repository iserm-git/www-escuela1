"use client";

import { Button, Stack, Chip } from "@mui/material";
import {
  Today as TodayIcon,
  CalendarMonth as CalendarIcon,
  DateRange as DateRangeIcon,
} from "@mui/icons-material";

interface DatePresetsProps {
  onSelect: (startDate: string, endDate: string) => void;
  size?: "small" | "medium" | "large";
  variant?: "buttons" | "chips";
  orientation?: "horizontal" | "vertical";
}

export default function DatePresets({
  onSelect,
  size = "small",
  variant = "buttons",
  orientation = "horizontal",
}: DatePresetsProps) {
  const today = new Date().toISOString().split("T")[0];

  const getDateRange = (preset: string): [string, string] => {
    const date = new Date();

    switch (preset) {
      case "hoy":
        return [today, today];

      case "ayer":
        const yesterday = new Date(date);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split("T")[0];
        return [yesterdayStr, yesterdayStr];

      case "esta-semana":
        const startWeek = new Date(date);
        const dayOfWeek = startWeek.getDay();
        const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Lunes
        startWeek.setDate(startWeek.getDate() + diff);
        return [startWeek.toISOString().split("T")[0], today];

      case "semana-pasada":
        const lastWeekEnd = new Date(date);
        const lastWeekDayOfWeek = lastWeekEnd.getDay();
        const lastWeekDiff =
          lastWeekDayOfWeek === 0 ? -6 : 1 - lastWeekDayOfWeek;
        lastWeekEnd.setDate(lastWeekEnd.getDate() + lastWeekDiff - 1); // Domingo
        const lastWeekStart = new Date(lastWeekEnd);
        lastWeekStart.setDate(lastWeekStart.getDate() - 6); // Lunes
        return [
          lastWeekStart.toISOString().split("T")[0],
          lastWeekEnd.toISOString().split("T")[0],
        ];

      case "este-mes":
        const startMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        return [startMonth.toISOString().split("T")[0], today];

      case "mes-pasado":
        const lastMonthStart = new Date(
          date.getFullYear(),
          date.getMonth() - 1,
          1
        );
        const lastMonthEnd = new Date(date.getFullYear(), date.getMonth(), 0);
        return [
          lastMonthStart.toISOString().split("T")[0],
          lastMonthEnd.toISOString().split("T")[0],
        ];

      case "ultimos-7-dias":
        const last7 = new Date(date);
        last7.setDate(last7.getDate() - 7);
        return [last7.toISOString().split("T")[0], today];

      case "ultimos-30-dias":
        const last30 = new Date(date);
        last30.setDate(last30.getDate() - 30);
        return [last30.toISOString().split("T")[0], today];

      case "ultimos-90-dias":
        const last90 = new Date(date);
        last90.setDate(last90.getDate() - 90);
        return [last90.toISOString().split("T")[0], today];

      default:
        return [today, today];
    }
  };

  const presets = [
    { key: "hoy", label: "Hoy", icon: <TodayIcon fontSize="small" /> },
    { key: "ayer", label: "Ayer" },
    {
      key: "esta-semana",
      label: "Esta Semana",
      icon: <CalendarIcon fontSize="small" />,
    },
    { key: "ultimos-7-dias", label: "Últimos 7 días" },
    { key: "este-mes", label: "Este Mes" },
    { key: "ultimos-30-dias", label: "Últimos 30 días" },
  ];

  const handleSelect = (preset: string) => {
    const [start, end] = getDateRange(preset);
    onSelect(start, end);
  };

  if (variant === "chips") {
    return (
      <Stack direction="row" spacing={1} flexWrap="wrap">
        {presets.map((preset) => (
          <Chip
            key={preset.key}
            label={preset.label}
            icon={preset.icon}
            onClick={() => handleSelect(preset.key)}
            size={size}
            clickable
          />
        ))}
      </Stack>
    );
  }

  return (
    <Stack
      direction={orientation === "horizontal" ? "row" : "column"}
      spacing={1}
      flexWrap="wrap"
    >
      {presets.map((preset) => (
        <Button
          key={preset.key}
          size={size}
          variant="outlined"
          startIcon={preset.icon}
          onClick={() => handleSelect(preset.key)}
        >
          {preset.label}
        </Button>
      ))}
    </Stack>
  );
}
