"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard, Activity, Calendar, Users } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="container py-6 space-y-6 bg-black text-white">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-black/40 border border-white/10 text-white">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-yellow-400" />
              <CardTitle className="text-white">Recent Activities</CardTitle>
            </div>
            <CardDescription className="text-gray-400">Your recently created activities</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-400">You have no recent activities.</p>
            <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white" size="sm" asChild>
              <Link href="/activities/new">Create Activity</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border border-white/10 text-white">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-400" />
              <CardTitle className="text-white">Training Plans</CardTitle>
            </div>
            <CardDescription className="text-gray-400">Your recent training plans</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-400">You have no recent training plans.</p>
            <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white" size="sm" asChild>
              <Link href="/build">Create Training Plan</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border border-white/10 text-white">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-400" />
              <CardTitle className="text-white">Teams</CardTitle>
            </div>
            <CardDescription className="text-gray-400">Teams you're a part of</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-400">You haven't joined any teams yet.</p>
            <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white" size="sm" asChild>
              <Link href="/teams">Manage Teams</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
