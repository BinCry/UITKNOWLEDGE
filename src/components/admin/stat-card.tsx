import { Card, CardContent } from "@/components/ui/card";

export function StatCard({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note?: string;
}) {
  return (
    <Card className="border-black/10 bg-white/90 shadow-sm">
      <CardContent className="p-5">
        <p className="text-sm text-black/45">{label}</p>
        <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
        {note ? <p className="mt-1 text-sm text-black/60">{note}</p> : null}
      </CardContent>
    </Card>
  );
}

