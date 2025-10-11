// apps/reactjs/lw2025/www-escuela/app/not-found.tsx
import Link from "next/link";
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Stack,
} from "@mui/material";
import SearchOffIcon from "@mui/icons-material/SearchOff";

export default function NotFound() {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper sx={{ p: 5 }}>
        <Stack spacing={2} alignItems="center" textAlign="center">
          <SearchOffIcon sx={{ fontSize: 64 }} color="secondary" />
          <Typography variant="h4" fontWeight={700}>
            Página no encontrada
          </Typography>
          <Typography color="text.secondary">
            La ruta que intentas abrir no existe o se ha movido.
          </Typography>
          <Box>
            <Button
              component={Link}
              href="/home"
              variant="contained"
              sx={{ mr: 1 }}
            >
              Ir al Dashboard
            </Button>
            <Button component={Link} href="/" variant="outlined">
              Volver al inicio
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
}
