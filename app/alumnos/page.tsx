"use client";
import { useState, useMemo, useCallback } from "react";
import { Box, Button, Stack } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridToolbar,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import Link from "next/link";
import AlumnoDialog from "@/components/AlumnoDialog";

type Alumno = { id: number; nombre: string; matricula: string };

export default function AlumnosPage() {
  const [rows, setRows] = useState<Alumno[]>([
    { id: 1, nombre: "Ana Pérez", matricula: "A001" },
    { id: 2, nombre: "Luis Díaz", matricula: "A002" },
  ]);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Alumno | null>(null);

  const handleDelete = useCallback((id: number) =>
    setRows((prev) => prev.filter((r) => r.id !== id)), []);

  const handleNew = useCallback(() => {
    setEditing(null);
    setOpen(true);
  }, []);
  
  const handleEdit = useCallback((alumno: Alumno) => {
    setEditing(alumno);
    setOpen(true);
  }, []);

  const handleSave = (a: {
    id?: number;
    nombre: string;
    matricula: string;
  }) => {
    if (a.id) {
      setRows((prev) => prev.map((r) => (r.id === a.id ? (a as Alumno) : r)));
    } else {
      const nextId = Math.max(0, ...rows.map((r) => r.id)) + 1;
      setRows((prev) => [
        ...prev,
        { id: nextId, nombre: a.nombre, matricula: a.matricula },
      ]);
    }
    setOpen(false);
  };

  const columns = useMemo<GridColDef<Alumno>[]>(
    () => [
      { field: "nombre", headerName: "Nombre", flex: 1 },
      { field: "matricula", headerName: "Matrícula", width: 160 },
      {
        field: "acciones",
        headerName: "Acciones",
        width: 320,
        sortable: false,
        filterable: false,
        renderCell: (params: GridRenderCellParams<Alumno>) => (
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              component={Link}
              href={`/alumnos/${params.row.id}`}
              variant="outlined"
            >
              Detalle
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={() => handleEdit(params.row)}
            >
              Editar
            </Button>
            <Button
              size="small"
              color="error"
              variant="contained"
              onClick={() => handleDelete(params.row.id)}
            >
              Borrar
            </Button>
          </Stack>
        ),
      },
    ],
    [handleEdit, handleDelete]
  );

  return (
    <Box sx={{ height: 520, width: "100%", p: 2 }}>
      <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
        <Button onClick={handleNew}>+ Nuevo</Button>
      </Stack>
      <DataGrid
        rows={rows}
        columns={columns}
        disableRowSelectionOnClick
        pageSizeOptions={[5, 10, 25]}
        initialState={{
          pagination: { paginationModel: { pageSize: 10, page: 0 } },
          columns: { columnVisibilityModel: { id: false } },
        }}
        slots={{ toolbar: GridToolbar }}
        slotProps={{ toolbar: { showQuickFilter: true } }}
      />
      <AlumnoDialog
        open={open}
        initial={editing ?? undefined}
        onClose={() => setOpen(false)}
        onSave={handleSave}
      />
    </Box>
  );
}
