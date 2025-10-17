"use client";

import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  LinearProgress,
  Chip,
  Avatar,
  useTheme,
  alpha,
} from "@mui/material";

// Íconos
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import RemoveIcon from "@mui/icons-material/Remove";

// Tipos
export type TrendType = "up" | "down" | "flat";
export type SizeType = "small" | "medium" | "large";
export type VariantType = "default" | "gradient" | "outlined" | "compact";

interface EstadisticasCardProps {
  /**
   * Título de la estadística
   */
  title: string;
  /**
   * Valor principal a mostrar
   */
  value: string | number;
  /**
   * Ícono a mostrar
   */
  icon?: React.ReactNode;
  /**
   * Color del tema
   * @default "primary"
   */
  color?: "primary" | "secondary" | "success" | "error" | "warning" | "info";
  /**
   * Subtítulo o descripción
   */
  subtitle?: string;
  /**
   * Tendencia (up, down, flat)
   */
  trend?: TrendType;
  /**
   * Valor de cambio en la tendencia
   */
  trendValue?: string | number;
  /**
   * Mostrar barra de progreso
   */
  showProgress?: boolean;
  /**
   * Valor de la barra de progreso (0-100)
   */
  progressValue?: number;
  /**
   * Etiqueta de la barra de progreso
   */
  progressLabel?: string;
  /**
   * Tamaño de la tarjeta
   * @default "medium"
   */
  size?: SizeType;
  /**
   * Variante del diseño
   * @default "default"
   */
  variant?: VariantType;
  /**
   * Mostrar como destacado
   * @default false
   */
  featured?: boolean;
  /**
   * Callback al hacer click
   */
  onClick?: () => void;
  /**
   * Mostrar badge
   */
  badge?: string;
  /**
   * Color del badge
   */
  badgeColor?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "warning"
    | "info";
}

export default function EstadisticasCard({
  title,
  value,
  icon,
  color = "primary",
  subtitle,
  trend,
  trendValue,
  showProgress = false,
  progressValue = 0,
  progressLabel,
  size = "medium",
  variant = "default",
  featured = false,
  onClick,
  badge,
  badgeColor = "default",
}: EstadisticasCardProps) {
  const theme = useTheme();

  // Obtener color del tema
  const themeColor = theme.palette[color].main;

  // Tamaños según la prop size
  const sizes = {
    small: { value: "h5", icon: 32, padding: 2 },
    medium: { value: "h4", icon: 40, padding: 2.5 },
    large: { value: "h3", icon: 48, padding: 3 },
  };

  const currentSize = sizes[size];

  // Obtener ícono de tendencia
  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <TrendingUpIcon fontSize="small" color="success" />;
      case "down":
        return <TrendingDownIcon fontSize="small" color="error" />;
      case "flat":
        return <RemoveIcon fontSize="small" color="action" />;
      default:
        return null;
    }
  };

  // Obtener color de tendencia
  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return theme.palette.success.main;
      case "down":
        return theme.palette.error.main;
      case "flat":
        return theme.palette.action.active;
      default:
        return theme.palette.text.secondary;
    }
  };

  // Estilos según variante
  const getCardStyles = () => {
    const baseStyles = {
      height: "100%",
      cursor: onClick ? "pointer" : "default",
      transition: "all 0.3s ease",
      "&:hover": onClick
        ? {
            transform: "translateY(-4px)",
            boxShadow: 4,
          }
        : {},
    };

    switch (variant) {
      case "gradient":
        return {
          ...baseStyles,
          background: `linear-gradient(135deg, ${themeColor} 0%, ${alpha(
            themeColor,
            0.7
          )} 100%)`,
          color: "white",
        };
      case "outlined":
        return {
          ...baseStyles,
          border: 2,
          borderColor: themeColor,
        };
      case "compact":
        return {
          ...baseStyles,
          boxShadow: 0,
        };
      default:
        return baseStyles;
    }
  };

  // Renderizar ícono
  const renderIcon = () => {
    if (!icon) return null;

    if (variant === "gradient") {
      return (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: currentSize.icon + 16,
            height: currentSize.icon + 16,
            borderRadius: 2,
            bgcolor: alpha("#fff", 0.2),
            "& svg": { fontSize: currentSize.icon, color: "white" },
          }}
        >
          {icon}
        </Box>
      );
    }

    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: currentSize.icon + 16,
          height: currentSize.icon + 16,
          borderRadius: 2,
          bgcolor: alpha(themeColor, 0.1),
          "& svg": { fontSize: currentSize.icon, color: themeColor },
        }}
      >
        {icon}
      </Box>
    );
  };

  return (
    <Card sx={getCardStyles()} onClick={onClick}>
      <CardContent
        sx={{
          p: currentSize.padding,
          "&:last-child": { pb: currentSize.padding },
        }}
      >
        <Stack spacing={variant === "compact" ? 1 : 2}>
          {/* Header: Ícono y Badge */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
          >
            {renderIcon()}
            {badge && (
              <Chip
                label={badge}
                size="small"
                color={badgeColor}
                sx={
                  variant === "gradient"
                    ? { bgcolor: alpha("#fff", 0.2), color: "white" }
                    : undefined
                }
              />
            )}
          </Stack>

          {/* Valor Principal */}
          <Box>
            <Typography
              variant={currentSize.value}
              fontWeight="bold"
              sx={{
                color:
                  variant === "gradient"
                    ? "white"
                    : featured
                    ? themeColor
                    : "inherit",
              }}
            >
              {value}
            </Typography>
            <Typography
              variant={size === "small" ? "body2" : "body1"}
              color={
                variant === "gradient"
                  ? "rgba(255,255,255,0.9)"
                  : "text.secondary"
              }
              sx={{ mt: 0.5 }}
            >
              {title}
            </Typography>
          </Box>

          {/* Subtítulo */}
          {subtitle && (
            <Typography
              variant="caption"
              color={
                variant === "gradient"
                  ? "rgba(255,255,255,0.7)"
                  : "text.secondary"
              }
            >
              {subtitle}
            </Typography>
          )}

          {/* Tendencia */}
          {trend && (
            <Stack direction="row" spacing={1} alignItems="center">
              {getTrendIcon()}
              <Typography
                variant="body2"
                fontWeight="bold"
                sx={{
                  color: variant === "gradient" ? "white" : getTrendColor(),
                }}
              >
                {trendValue}
              </Typography>
              {trendValue && (
                <Typography
                  variant="caption"
                  color={
                    variant === "gradient"
                      ? "rgba(255,255,255,0.7)"
                      : "text.secondary"
                  }
                >
                  vs anterior
                </Typography>
              )}
            </Stack>
          )}

          {/* Barra de Progreso */}
          {showProgress && (
            <Box>
              {progressLabel && (
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  sx={{ mb: 0.5 }}
                >
                  <Typography
                    variant="caption"
                    color={
                      variant === "gradient"
                        ? "rgba(255,255,255,0.9)"
                        : "text.secondary"
                    }
                  >
                    {progressLabel}
                  </Typography>
                  <Typography
                    variant="caption"
                    fontWeight="bold"
                    color={variant === "gradient" ? "white" : themeColor}
                  >
                    {progressValue}%
                  </Typography>
                </Stack>
              )}
              <LinearProgress
                variant="determinate"
                value={progressValue}
                sx={{
                  height: 8,
                  borderRadius: 1,
                  bgcolor:
                    variant === "gradient"
                      ? alpha("#fff", 0.2)
                      : alpha(themeColor, 0.1),
                  "& .MuiLinearProgress-bar": {
                    bgcolor: variant === "gradient" ? "white" : themeColor,
                  },
                }}
              />
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

// Componente auxiliar - Grupo de estadísticas
export function EstadisticasCardGrid({
  stats,
  columns = { xs: 12, sm: 6, md: 3 },
}: {
  stats: EstadisticasCardProps[];
  columns?: { xs?: number; sm?: number; md?: number; lg?: number };
}) {
  return (
    <>
      {stats.map((stat, index) => (
        <Box
          key={index}
          sx={{
            gridColumn: {
              xs: `span ${columns.xs || 12}`,
              sm: `span ${columns.sm || 6}`,
              md: `span ${columns.md || 3}`,
              lg: `span ${columns.lg || columns.md || 3}`,
            },
          }}
        >
          <EstadisticasCard {...stat} />
        </Box>
      ))}
    </>
  );
}

// Componente auxiliar - Tarjeta compacta horizontal
export function EstadisticasCardCompact({
  title,
  value,
  icon,
  color = "primary",
  onClick,
}: Pick<
  EstadisticasCardProps,
  "title" | "value" | "icon" | "color" | "onClick"
>) {
  const theme = useTheme();
  const themeColor = theme.palette[color].main;

  return (
    <Card
      sx={{
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.2s ease",
        "&:hover": onClick ? { boxShadow: 3 } : {},
      }}
      onClick={onClick}
    >
      <CardContent sx={{ py: 1.5, px: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          {icon && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40,
                borderRadius: 1,
                bgcolor: alpha(themeColor, 0.1),
                "& svg": { fontSize: 24, color: themeColor },
              }}
            >
              {icon}
            </Box>
          )}
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" fontWeight="bold">
              {value}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {title}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
