// app/alumnos/[id]/page.tsx
type Params = { params: { id: string } };

export default function AlumnoDetail({ params }: Params) {
  const { id } = params;
  // Aquí podrías consultar API por ID. Por ahora, texto simple:
  return (
    <main style={{ padding: 16 }}>
      <h1>Detalle del Alumno #{id}</h1>
      <p>Información del alumno (simulada).</p>
    </main>
  );
}
