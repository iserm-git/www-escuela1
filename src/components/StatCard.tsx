import { Card, CardContent, Typography } from "@mui/material";
export default function StatCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="overline" color="text.secondary">
          {title}
        </Typography>
        <Typography variant="h5" fontWeight={700}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}
