"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Divider,
  Grid,
  Chip,
  Paper,
  Stack,
} from "@mui/material";

// Iconos
import PersonIcon from "@mui/icons-material/Person";
import BadgeIcon from "@mui/icons-material/Badge";
import SchoolIcon from "@mui/icons-material/School";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import FingerprintIcon from "@mui/icons-material/Fingerprint";

type Alumno = {
  id: number;
  nombre: string;
  matricula: string;
  carrera?: string;
  activo?: boolean;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  curp?: string;
  email?: string;
  telefono?: string;
  fechaIngreso?: string;
};

type AlumnoDetailDialogProps = {
  open: boolean;
  alumno: Alumno | null;
  onClose: () => void;
};

// Mapeo de carreras
const CARRERAS_MAP: Record<string, string> = {
  ISC: "Ingeniería en Sistemas Computacionales",
  ITIC: "Ingeniería en Tecnologías de la Información y Comunicaciones",
  IIND: "Ingeniería Industrial",
  CP: "Contador Público",
  IIA: "Ingeniería en Industrias Alimentarias",
  IGE: "Ingeniería en Gestión Empresarial",
  IE: "Ingeniería Electromecánica",
  IIAS: "Ingeniería en Innovación Agrícola Sustentable",
  ARQ: "Arquitectura",
};

export default function AlumnoDetailDialog({
  open,
  alumno,
  onClose,
}: AlumnoDetailDialogProps) {
  if (!alumno) return null;

  const nombreCompleto = [
    alumno.nombre,
    alumno.apellidoPaterno,
    alumno.apellidoMaterno,
  ]
    .filter(Boolean)
    .join(" ");

  const carreraCompleta = alumno.carrera
    ? CARRERAS_MAP[alumno.carrera] || alumno.carrera
    : "No asignada";

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ bgcolor: "primary.main", color: "white", pb: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <PersonIcon sx={{ fontSize: 32 }} />
          <Box>
            <Typography variant="h5" fontWeight="bold">
              Información del Alumno
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Detalles completos del registro
            </Typography>
          </Box>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        {/* Sección: Estado */}
        <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: "grey.50" }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="subtitle2" color="text.secondary">
              Estado:
            </Typography>
            <Chip
              icon={alumno.activo ? <CheckCircleIcon /> : <CancelIcon />}
              label={alumno.activo ? "Activo" : "Inactivo"}
              color={alumno.activo ? "success" : "default"}
              size="medium"
            />
          </Stack>
        </Paper>

        {/* Datos Personales */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <PersonIcon color="primary" />
            Datos Personales
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <DetailItem label="Nombre Completo" value={nombreCompleto} />
            </Grid>

            {alumno.curp && (
              <Grid item xs={12} sm={6}>
                <DetailItem
                  label="CURP"
                  value={alumno.curp}
                  icon={<FingerprintIcon fontSize="small" />}
                />
              </Grid>
            )}

            {alumno.email && (
              <Grid item xs={12} sm={6}>
                <DetailItem label="Correo Electrónico" value={alumno.email} />
              </Grid>
            )}

            {alumno.telefono && (
              <Grid item xs={12} sm={6}>
                <DetailItem label="Teléfono" value={alumno.telefono} />
              </Grid>
            )}
          </Grid>
        </Box>

        {/* Datos Académicos */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <SchoolIcon color="primary" />
            Datos Académicos
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <DetailItem
                label="Matrícula"
                value={alumno.matricula}
                icon={<BadgeIcon fontSize="small" />}
                highlight
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <DetailItem label="Carrera" value={carreraCompleta} />
            </Grid>

            {alumno.fechaIngreso && (
              <Grid item xs={12} sm={6}>
                <DetailItem
                  label="Fecha de Ingreso"
                  value={alumno.fechaIngreso}
                  icon={<CalendarTodayIcon fontSize="small" />}
                />
              </Grid>
            )}

            <Grid item xs={12} sm={6}>
              <DetailItem label="ID del Sistema" value={`#${alumno.id}`} />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="contained" size="large">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// Componente auxiliar para mostrar items de detalle
function DetailItem({
  label,
  value,
  icon,
  highlight = false,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <Box>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: "block", mb: 0.5 }}
      >
        {label}
      </Typography>
      <Stack direction="row" spacing={1} alignItems="center">
        {icon && <Box sx={{ color: "primary.main" }}>{icon}</Box>}
        <Typography
          variant="body1"
          sx={{
            fontWeight: highlight ? 600 : 400,
            color: highlight ? "primary.main" : "text.primary",
          }}
        >
          {value}
        </Typography>
      </Stack>
    </Box>
  );
}
