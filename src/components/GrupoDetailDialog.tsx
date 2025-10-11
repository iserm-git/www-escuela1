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
  LinearProgress,
} from "@mui/material";
// Iconos
import GroupIcon from "@mui/icons-material/Group";
import BadgeIcon from "@mui/icons-material/Badge";
import SchoolIcon from "@mui/icons-material/School";
import PeopleIcon from "@mui/icons-material/People";
import ClassIcon from "@mui/icons-material/Class";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

type Grupo = {
  id: number;
  clave: string;
  nombre: string;
  carrera: string;
  limite_alumnos: number;
  alumnos_inscritos: number;
};

type GrupoDetailDialogProps = {
  open: boolean;
  grupo: Grupo | null;
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

export default function GrupoDetailDialog({
  open,
  grupo,
  onClose,
}: GrupoDetailDialogProps) {
  if (!grupo) return null;

  const carreraCompleta = CARRERAS_MAP[grupo.carrera] || grupo.carrera;
  const ocupacion = (grupo.alumnos_inscritos / grupo.limite_alumnos) * 100;
  const cuposDisponibles = grupo.limite_alumnos - grupo.alumnos_inscritos;

  // Determinar color de ocupación
  const getOcupacionColor = () => {
    if (ocupacion >= 90) return "error";
    if (ocupacion >= 70) return "warning";
    return "success";
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ bgcolor: "primary.main", color: "white", pb: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <GroupIcon sx={{ fontSize: 32 }} />
          <Box>
            <Typography variant="h5" fontWeight="bold">
              Información del Grupo
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Detalles completos del registro
            </Typography>
          </Box>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        {/* Sección: Ocupación destacada */}
        <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: "grey.50" }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Ocupación del Grupo
          </Typography>
          <Stack spacing={2}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Chip
                icon={<PeopleIcon />}
                label={`${grupo.alumnos_inscritos} / ${grupo.limite_alumnos} alumnos`}
                color={getOcupacionColor()}
                size="medium"
              />
              <Chip
                label={`${ocupacion.toFixed(1)}% ocupado`}
                color={getOcupacionColor()}
                variant="outlined"
                size="medium"
              />
              <Chip
                icon={<PersonAddIcon />}
                label={`${cuposDisponibles} cupos disponibles`}
                color={cuposDisponibles > 0 ? "success" : "error"}
                variant="outlined"
                size="medium"
              />
            </Stack>
            <Box>
              <LinearProgress
                variant="determinate"
                value={ocupacion}
                color={getOcupacionColor()}
                sx={{ height: 8, borderRadius: 1 }}
              />
            </Box>
          </Stack>
        </Paper>

        {/* Datos del Grupo */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <GroupIcon color="primary" />
            Datos del Grupo
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <DetailItem
                label="Nombre del Grupo"
                value={grupo.nombre}
                highlight
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DetailItem
                label="Clave del Grupo"
                value={grupo.clave}
                icon={<BadgeIcon fontSize="small" />}
                highlight
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DetailItem
                label="ID del Sistema"
                value={`#${grupo.id}`}
                icon={<BadgeIcon fontSize="small" />}
              />
            </Grid>
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
            Asignación Académica
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <DetailItem
                label="Carrera"
                value={carreraCompleta}
                icon={<ClassIcon fontSize="small" />}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DetailItem label="Código de Carrera" value={grupo.carrera} />
            </Grid>
          </Grid>
        </Box>

        {/* Capacidad del Grupo */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <PeopleIcon color="primary" />
            Capacidad y Estadísticas
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <DetailItem
                label="Límite de Alumnos"
                value={`${grupo.limite_alumnos} alumnos`}
                icon={<PeopleIcon fontSize="small" />}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DetailItem
                label="Alumnos Inscritos"
                value={`${grupo.alumnos_inscritos} alumnos`}
                icon={<PersonAddIcon fontSize="small" />}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DetailItem
                label="Cupos Disponibles"
                value={`${cuposDisponibles} ${
                  cuposDisponibles === 1 ? "cupo" : "cupos"
                }`}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DetailItem
                label="Porcentaje de Ocupación"
                value={`${ocupacion.toFixed(1)}%`}
              />
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
