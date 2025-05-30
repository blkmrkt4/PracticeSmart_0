"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, UserPlus, Settings, Share2 } from "lucide-react";

export default function TeamsPage() {
  const [createTeamOpen, setCreateTeamOpen] = useState(false);
  
  return (
    <div className="container py-6 space-y-6 bg-black text-white">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Teams</h1>
        <Button onClick={() => setCreateTeamOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
          <UserPlus className="mr-2 h-4 w-4" />
          Create Team
        </Button>
      </div>

      <Tabs defaultValue="my-teams">
        <TabsList className="bg-black/40 border border-white/10">
          <TabsTrigger value="my-teams" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">My Teams</TabsTrigger>
          <TabsTrigger value="invitations" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Invitations</TabsTrigger>
        </TabsList>
        <TabsContent value="my-teams" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-black/40 border border-white/10 text-white">
              <CardHeader>
                <CardTitle className="text-white">Create a Team</CardTitle>
                <CardDescription className="text-gray-400">Start collaborating with others</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center py-6">
                <Users className="h-16 w-16 text-purple-400" />
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setCreateTeamOpen(true)}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create New Team
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="invitations" className="space-y-4">
          <Card className="bg-black/40 border border-white/10 text-white">
            <CardHeader>
              <CardTitle className="text-white">Team Invitations</CardTitle>
              <CardDescription className="text-gray-400">Pending invitations to join teams</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400">You have no pending invitations.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={createTeamOpen} onOpenChange={setCreateTeamOpen}>
        <DialogContent className="bg-black/90 border border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Create Team</DialogTitle>
            <DialogDescription className="text-gray-400">
              Create a new team to share activities and training plans with others.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="team-name" className="text-white">Team Name</Label>
              <Input id="team-name" placeholder="Enter team name" className="bg-white/10 border-white/20 text-white placeholder:text-white/50" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="team-description" className="text-white">Description (Optional)</Label>
              <Input id="team-description" placeholder="Brief description of your team" className="bg-white/10 border-white/20 text-white placeholder:text-white/50" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="privacy" className="text-white">Privacy Setting</Label>
              <Select defaultValue="private">
                <SelectTrigger id="privacy" className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Select privacy setting" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border border-white/10 text-white">
                  <SelectItem value="private">Private - Only visible to team members</SelectItem>
                  <SelectItem value="public">Public - Visible to all users</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/20" onClick={() => setCreateTeamOpen(false)}>Cancel</Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Create Team</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
