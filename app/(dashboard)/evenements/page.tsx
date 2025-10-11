"use client";

import { Loader2, Plus } from "lucide-react";

import { useNewEvent } from "@/features/events/hooks/use-new-event";
import { useGetEvents } from "@/features/events/api/use-get-events";
import { useBulkDeleteEvents } from "@/features/events/api/use-bulk-delete-events";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { columns } from "./columns";

const EventsPage = () => {
  const newEvent = useNewEvent();
  const deleteEvents = useBulkDeleteEvents();
  const eventsQuery = useGetEvents();
  const events = eventsQuery.data || [];

  const isDisabled = eventsQuery.isLoading || deleteEvents.isPending;

  if (eventsQuery.isLoading) {
    return (
      <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
        <Card className="border-none drop-shadow-sm">
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <div className="h-[500px] w-full flex items-center justify-center">
              <Loader2 className="size-6 text-slate-300 animate-spin" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">Évènements</CardTitle>
          <Button onClick={newEvent.onOpen} size="sm">
            <Plus className="size-4 mr-2" />
            Ajouter un évènement
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            filterKeys={["type"]}
            columns={columns}
            data={events}
            onDelete={(row) => {
              const ids = row.map((r) => Number(r.original.id));
              deleteEvents.mutate({ ids });
            }}
            disabled={isDisabled}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default EventsPage;
