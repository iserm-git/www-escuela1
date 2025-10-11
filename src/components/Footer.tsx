"use client";
import { Box, Container, Typography } from "@mui/material";
export default function Footer() {
  return (
    <Box component="footer" sx={{ borderTop: "1px solid #eee", mt: 3, py: 2 }}>
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary">
          Sistema Escolar · © {new Date().getFullYear()}
        </Typography>
      </Container>
    </Box>
  );
}
