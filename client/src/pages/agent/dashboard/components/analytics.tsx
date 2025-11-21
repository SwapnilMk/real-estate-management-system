import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AnalyticsProps {
  propertiesByType?: { _id: string; count: number }[];
}

export function Analytics({ propertiesByType }: AnalyticsProps) {
  const totalProperties =
    propertiesByType?.reduce((acc, curr) => acc + curr.count, 0) || 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-4">
          <CardHeader>
            <CardTitle>Properties by Type</CardTitle>
            <CardDescription>
              Distribution of your property portfolio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleBarList
              items={
                propertiesByType?.map((item) => ({
                  name: item._id,
                  value: item.count,
                })) || []
              }
              barClass="bg-primary"
              valueFormatter={(n) =>
                `${n} (${Math.round((n / totalProperties) * 100)}%)`
              }
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SimpleBarList({
  items,
  valueFormatter,
  barClass,
}: {
  items: { name: string; value: number }[];
  valueFormatter: (n: number) => string;
  barClass: string;
}) {
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <ul className="space-y-3">
      {items.map((i) => {
        const width = `${Math.round((i.value / max) * 100)}%`;
        return (
          <li key={i.name} className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="text-muted-foreground mb-1 truncate text-xs">
                {i.name}
              </div>
              <div className="bg-muted h-2.5 w-full rounded-full">
                <div
                  className={`h-2.5 rounded-full ${barClass}`}
                  style={{ width }}
                />
              </div>
            </div>
            <div className="ps-2 text-xs font-medium tabular-nums">
              {valueFormatter(i.value)}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
