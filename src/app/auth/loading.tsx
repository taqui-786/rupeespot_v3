import { BadgePercent } from "lucide-react";

export default function Loading() {
  return (
    <>
      <div className="p-4 centerIt">
        <BadgePercent className="h-11 w-11 animate-spin text-primary " />
      </div>
    </>
  );
}