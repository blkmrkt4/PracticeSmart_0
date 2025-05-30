"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Plus, Filter, Search } from "lucide-react";
import Link from "next/link";

export default function ActivitiesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSport, setFilterSport] = useState("all");
  
  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Activities</h1>
        <Button asChild>
          <Link href="/activities/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Activity
          </Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search activities..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={filterSport} onValueChange={setFilterSport}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by sport" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sports</SelectItem>
            <SelectItem value="soccer-football">Soccer/Football</SelectItem>
            <SelectItem value="basketball">Basketball</SelectItem>
            <SelectItem value="volleyball">Volleyball</SelectItem>
            <SelectItem value="baseball">Baseball</SelectItem>
            <SelectItem value="tennis">Tennis</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="my-activities">
        <TabsList>
          <TabsTrigger value="my-activities">My Activities</TabsTrigger>
          <TabsTrigger value="team-activities">Team Activities</TabsTrigger>
          <TabsTrigger value="public-activities">Public Activities</TabsTrigger>
        </TabsList>
        <TabsContent value="my-activities" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Create New Activity</CardTitle>
                <CardDescription>Design a custom activity for your practices</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center py-6">
                <Activity className="h-16 w-16 text-muted-foreground" />
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link href="/activities/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Activity
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="team-activities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Activities</CardTitle>
              <CardDescription>Activities shared with your teams</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">You don't have any team activities yet. Join a team or create activities with team privacy settings.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="public-activities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Public Activities</CardTitle>
              <CardDescription>Activities shared by the community</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">No public activities are available yet.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
