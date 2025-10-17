"use client";

import { useState } from "react";
import {
  Button,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Tooltip,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Stack,
  Divider,
} from "@mui/material";

// Íconos
import DownloadIcon from "@mui/icons-material/Download";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import TableChartIcon from "@mui/icons-material/TableChart";
import ImageIcon from "@mui/icons-material/Image";
import DescriptionIcon from "@mui/icons-material/Description";
import PrintIcon from "@mui/icons-material/Print";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

// Tipos
export type ExportFormat = "pdf" | "excel" | "csv" | "image" | "print";

export interface ExportOptions {
  filename?: string;
  title?: string;
  orientation?: "portrait" | "landscape";
  includeCharts?: boolean;
  includeHeader?: boolean;
  includeFooter?: boolean;
  [key: string]: any;
}

interface ExportButtonProps {
  /**
   * Formatos de exportación disponibles
   * @default ["pdf", "excel"]
   */
  formats?: ExportFormat[];
  /**
   * Función de exportación personalizada
   * Si no se proporciona, se usa una implementación por defecto
   */
  onExport?: (format: ExportFormat, options?: ExportOptions) => Promise<void>;
  /**
   * Opciones de exportación por defecto
   */
  defaultOptions?: ExportOptions;
  /**
   * Variante del botón
   * @default "button"
   */
  variant?: "button" | "icon" | "menu";
  /**
   * Tamaño del botón
   * @default "medium"
   */
  size?: "small" | "medium" | "large";
  /**
   * Texto del botón (solo para variant="button")
   * @default "Exportar"
   */
  buttonText?: string;
  /**
   * Mostrar texto de carga
   * @default true
   */
  showLoadingText?: boolean;
  /**
   * Deshabilitar el botón
   * @default false
   */
  disabled?: boolean;
  /**
   * Color del botón
   */
  color?: "primary" | "secondary" | "error" | "info" | "success" | "warning";
  /**
   * Callback después de exportación exitosa
   */
  onSuccess?: (format: ExportFormat) => void;
  /**
   * Callback después de error
   */
  onError?: (error: Error, format: ExportFormat) => void;
  /**
   * Mostrar diálogo de confirmación
   * @default false
   */
  showConfirmDialog?: boolean;
}

export default function ExportButton({
  formats = ["pdf", "excel"],
  onExport,
  defaultOptions = {},
  variant = "button",
  size = "medium",
  buttonText = "Exportar",
  showLoadingText = true,
  disabled = false,
  color = "primary",
  onSuccess,
  onError,
  showConfirmDialog = false,
}: ExportButtonProps) {
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat | null>(
    null
  );
  const [statusDialog, setStatusDialog] = useState<{
    open: boolean;
    success: boolean;
    message: string;
  }>({ open: false, success: false, message: "" });

  const openMenu = Boolean(anchorEl);

  // Configuración de formatos
  const formatConfig = {
    pdf: {
      label: "Exportar como PDF",
      icon: <PictureAsPdfIcon />,
      color: "error" as const,
    },
    excel: {
      label: "Exportar como Excel",
      icon: <TableChartIcon />,
      color: "success" as const,
    },
    csv: {
      label: "Exportar como CSV",
      icon: <DescriptionIcon />,
      color: "info" as const,
    },
    image: {
      label: "Exportar como Imagen",
      icon: <ImageIcon />,
      color: "secondary" as const,
    },
    print: {
      label: "Imprimir",
      icon: <PrintIcon />,
      color: "primary" as const,
    },
  };

  // Manejar apertura de menú
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Manejar cierre de menú
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Función de exportación por defecto
  const defaultExportFunction = async (
    format: ExportFormat,
    options?: ExportOptions
  ): Promise<void> => {
    // Simulación de exportación
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Generar nombre de archivo
    const timestamp = new Date().toISOString().slice(0, 10);
    const filename = options?.filename || `reporte_${timestamp}`;

    // Simular descarga
    console.log(`Exportando como ${format}:`, { filename, options });

    // En implementación real, aquí iría la lógica de exportación
    // Por ejemplo, usando librerías como jsPDF, xlsx, etc.
  };

  // Manejar exportación
  const handleExport = async (format: ExportFormat) => {
    if (showConfirmDialog) {
      setSelectedFormat(format);
      setConfirmDialogOpen(true);
      handleMenuClose();
      return;
    }

    await executeExport(format);
  };

  // Ejecutar exportación
  const executeExport = async (format: ExportFormat) => {
    setLoading(true);
    handleMenuClose();

    try {
      const exportFunction = onExport || defaultExportFunction;
      await exportFunction(format, defaultOptions);

      // Mostrar mensaje de éxito
      setStatusDialog({
        open: true,
        success: true,
        message: `Reporte exportado exitosamente como ${format.toUpperCase()}`,
      });

      // Callback de éxito
      if (onSuccess) {
        onSuccess(format);
      }
    } catch (error) {
      console.error("Error al exportar:", error);

      // Mostrar mensaje de error
      setStatusDialog({
        open: true,
        success: false,
        message: `Error al exportar: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`,
      });

      // Callback de error
      if (onError && error instanceof Error) {
        onError(error, format);
      }
    } finally {
      setLoading(false);
    }
  };

  // Confirmar exportación
  const handleConfirmExport = () => {
    setConfirmDialogOpen(false);
    if (selectedFormat) {
      executeExport(selectedFormat);
    }
  };

  // Renderizar según variante
  const renderButton = () => {
    // Si solo hay un formato, mostrar botón directo
    if (formats.length === 1 && variant !== "menu") {
      const format = formats[0];
      const config = formatConfig[format];

      if (variant === "icon") {
        return (
          <Tooltip title={config.label}>
            <span>
              <IconButton
                color={config.color}
                onClick={() => handleExport(format)}
                disabled={disabled || loading}
                size={size}
              >
                {loading ? <CircularProgress size={20} /> : config.icon}
              </IconButton>
            </span>
          </Tooltip>
        );
      }

      return (
        <Button
          variant="contained"
          color={config.color}
          startIcon={loading ? <CircularProgress size={20} /> : config.icon}
          onClick={() => handleExport(format)}
          disabled={disabled || loading}
          size={size}
        >
          {loading && showLoadingText ? "Exportando..." : config.label}
        </Button>
      );
    }

    // Múltiples formatos: mostrar menú
    if (variant === "icon") {
      return (
        <>
          <Tooltip title="Opciones de exportación">
            <span>
              <IconButton
                onClick={handleMenuOpen}
                disabled={disabled || loading}
                size={size}
                color={color}
              >
                {loading ? <CircularProgress size={20} /> : <DownloadIcon />}
              </IconButton>
            </span>
          </Tooltip>
        </>
      );
    }

    return (
      <Button
        variant="contained"
        color={color}
        startIcon={loading ? <CircularProgress size={20} /> : <DownloadIcon />}
        onClick={
          formats.length === 1 ? () => handleExport(formats[0]) : handleMenuOpen
        }
        disabled={disabled || loading}
        size={size}
        endIcon={formats.length > 1 ? <MoreVertIcon /> : undefined}
      >
        {loading && showLoadingText ? "Exportando..." : buttonText}
      </Button>
    );
  };

  return (
    <>
      {/* Botón principal */}
      {renderButton()}

      {/* Menú de opciones */}
      <Menu
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {formats.map((format) => {
          const config = formatConfig[format];
          return (
            <MenuItem key={format} onClick={() => handleExport(format)}>
              <ListItemIcon>{config.icon}</ListItemIcon>
              <ListItemText>{config.label}</ListItemText>
            </MenuItem>
          );
        })}
      </Menu>

      {/* Diálogo de confirmación */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <DialogTitle>Confirmar Exportación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Deseas exportar el reporte como{" "}
            <strong>{selectedFormat?.toUpperCase()}</strong>?
          </Typography>
          {defaultOptions.filename && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Archivo: {defaultOptions.filename}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Cancelar</Button>
          <Button
            onClick={handleConfirmExport}
            variant="contained"
            color="primary"
          >
            Exportar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de estado */}
      <Dialog
        open={statusDialog.open}
        onClose={() => setStatusDialog({ ...statusDialog, open: false })}
      >
        <DialogContent>
          <Stack spacing={2} alignItems="center" sx={{ py: 2 }}>
            {statusDialog.success ? (
              <CheckCircleIcon color="success" sx={{ fontSize: 64 }} />
            ) : (
              <ErrorIcon color="error" sx={{ fontSize: 64 }} />
            )}
            <Typography variant="h6" align="center">
              {statusDialog.success
                ? "¡Exportación Exitosa!"
                : "Error en la Exportación"}
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              {statusDialog.message}
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setStatusDialog({ ...statusDialog, open: false })}
            variant="contained"
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

// Componente auxiliar - Grupo de botones de exportación
export function ExportButtonGroup({
  formats = ["pdf", "excel"],
  onExport,
  defaultOptions,
  size = "small",
  disabled = false,
}: Pick<
  ExportButtonProps,
  "formats" | "onExport" | "defaultOptions" | "size" | "disabled"
>) {
  return (
    <Stack direction="row" spacing={1}>
      {formats.map((format) => (
        <ExportButton
          key={format}
          formats={[format]}
          onExport={onExport}
          defaultOptions={defaultOptions}
          variant="icon"
          size={size}
          disabled={disabled}
        />
      ))}
    </Stack>
  );
}
