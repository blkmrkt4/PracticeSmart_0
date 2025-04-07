import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="relative h-8 w-8">
                <Skeleton className="h-8 w-8 rounded-md bg-white/10" />
              </div>
              <Skeleton className="h-6 w-24 rounded-md bg-white/10" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-32 rounded-md bg-white/10" />
            <Skeleton className="h-8 w-24 rounded-md bg-white/10" />
            <Skeleton className="h-8 w-32 rounded-md bg-white/10" />
          </div>
        </div>
      </header>

      <main className="container px-4 py-6 md:px-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column - Settings and Drill Library */}
          <div className="lg:w-1/3 space-y-6">
            <div className="rounded-lg border border-white/10 bg-white/5 p-4 space-y-4">
              <Skeleton className="h-6 w-32 rounded-md bg-white/10" />
              <Skeleton className="h-4 w-48 rounded-md bg-white/10" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-16 rounded-md bg-white/10" />
                <Skeleton className="h-10 w-full rounded-md bg-white/10" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24 rounded-md bg-white/10" />
                <Skeleton className="h-4 w-full rounded-md bg-white/10" />
              </div>
            </div>

            <div className="rounded-lg border border-white/10 bg-white/5 p-4 space-y-4">
              <Skeleton className="h-6 w-24 rounded-md bg-white/10" />
              <Skeleton className="h-4 w-48 rounded-md bg-white/10" />
              <div className="flex gap-2 overflow-x-auto pb-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-6 w-20 rounded-full flex-shrink-0 bg-white/10" />
                ))}
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-10 flex-1 rounded-md bg-white/10" />
                <Skeleton className="h-10 w-32 rounded-md bg-white/10" />
              </div>
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-24 w-full rounded-md bg-white/10" />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Practice Plan Timeline */}
          <div className="lg:w-2/3 space-y-6">
            <div className="rounded-lg border border-white/10 bg-white/5 p-4 space-y-4">
              <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-48 rounded-md bg-white/10" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-24 rounded-md bg-white/10" />
                  <Skeleton className="h-6 w-24 rounded-md bg-white/10" />
                </div>
              </div>
              <Skeleton className="h-4 w-64 rounded-md bg-white/10" />
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-md bg-white/10" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

