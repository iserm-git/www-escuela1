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
import MenuBookIcon from "@mui/icons-material/MenuBook";
import BadgeIcon from "@mui/icons-material/Badge";
import SchoolIcon from "@mui/icons-material/School";
import StarIcon from "@mui/icons-material/Star";
import ClassIcon from "@mui/icons-material/Class";

type Materia = {
  id: number;
  clave: string;
  nombre: string;
  creditos: number;
  carrera?: string;
};

type MateriaDetailDialogProps = {
  open: boolean;
  materia: Materia | null;
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

export default function MateriaDetailDialog({
  open,
  materia,
  onClose,
}: MateriaDetailDialogProps) {
  if (!materia) return null;

  const carreraCompleta = materia.carrera
    ? CARRERAS_MAP[materia.carrera] || materia.carrera
    : "General / Todas las carreras";

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ bgcolor: "primary.main", color: "white", pb: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <MenuBookIcon sx={{ fontSize: 32 }} />
          <Box>
            <Typography variant="h5" fontWeight="bold">
              Información de la Materia
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Detalles completos del registro
            </Typography>
          </Box>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        {/* Sección: Créditos destacados */}
        <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: "grey.50" }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="subtitle2" color="text.secondary">
              Créditos:
            </Typography>
            <Chip
              icon={<StarIcon />}
              label={`${materia.creditos} ${
                materia.creditos === 1 ? "crédito" : "créditos"
              }`}
              color="secondary"
              size="medium"
            />
          </Stack>
        </Paper>

        {/* Datos de la Materia */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <MenuBookIcon color="primary" />
            Datos de la Materia
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <DetailItem
                label="Nombre de la Materia"
                value={materia.nombre}
                highlight
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <DetailItem
                label="Clave de Materia"
                value={materia.clave}
                icon={<BadgeIcon fontSize="small" />}
                highlight
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <DetailItem
                label="Créditos"
                value={`${materia.creditos}`}
                icon={<StarIcon fontSize="small" />}
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
                label="Carrera Asignada"
                value={carreraCompleta}
                icon={<ClassIcon fontSize="small" />}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <DetailItem label="ID del Sistema" value={`#${materia.id}`} />
            </Grid>

            {materia.carrera && (
              <Grid item xs={12} sm={6}>
                <DetailItem label="Código de Carrera" value={materia.carrera} />
              </Grid>
            )}
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
