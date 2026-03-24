import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type CatalogToolbarOption = {
  label: string;
  value: string;
};

type CatalogToolbarProps = {
  action: string;
  q?: string;
  category?: string;
  sort?: string;
  categories: CatalogToolbarOption[];
  sorts: CatalogToolbarOption[];
};

const selectClassName =
  "h-12 rounded-2xl border border-black/10 bg-white px-4 text-sm text-black shadow-sm outline-none transition focus:border-black/20";

export const CatalogToolbar = ({
  action,
  q,
  category,
  sort,
  categories,
  sorts,
}: CatalogToolbarProps) => {
  const hasCategoryFilter = categories.length > 1;

  return (
    <form
      action={action}
      method="get"
      className="surface-panel flex flex-col gap-3 rounded-[1.8rem] p-4 lg:flex-row lg:items-center"
    >
      <div className="relative min-w-0 flex-1">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-black/35" />
        <Input
          name="q"
          defaultValue={q}
          placeholder="Tìm theo môn, chủ đề hoặc từ khóa..."
          className="h-12 rounded-2xl border-black/10 bg-white pl-11"
        />
      </div>

      {hasCategoryFilter ? (
        <select name="category" defaultValue={category ?? "all"} className={cn(selectClassName, "lg:w-56")}>
          {categories.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      ) : null}

      <select name="sort" defaultValue={sort ?? "featured"} className={cn(selectClassName, "lg:w-48")}>
        {sorts.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>

      <Button type="submit" className="h-12 rounded-2xl bg-black px-5 text-white hover:bg-black/90">
        Áp dụng
      </Button>
    </form>
  );
};
