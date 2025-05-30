"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserPlus, Mail, Copy, Check } from "lucide-react";

export default function InvitePage() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");
  const [copied, setCopied] = useState(false);
  const [invites, setInvites] = useState([
    { email: "coach@example.com", role: "admin", status: "pending", date: "2025-05-25" },
    { email: "assistant@example.com", role: "member", status: "accepted", date: "2025-05-24" },
  ]);

  const handleInvite = () => {
    if (email) {
      setInvites([...invites, { email, role, status: "pending", date: new Date().toISOString().split('T')[0] }]);
      setEmail("");
    }
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText("https://practicesmart.app/join?code=INVITE123");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="container py-6 space-y-6 bg-black text-white">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Invite Users</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-black/40 border border-white/10 text-white">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-blue-400" />
              <CardTitle className="text-white">Send Email Invitation</CardTitle>
            </div>
            <CardDescription className="text-gray-400">
              Invite coaches, assistants, or team members to join your workspace.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role" className="text-white">Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger id="role" className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border border-white/10 text-white">
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleInvite} disabled={!email} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Mail className="mr-2 h-4 w-4" />
              Send Invitation
            </Button>
          </CardFooter>
        </Card>

        <Card className="bg-black/40 border border-white/10 text-white">
          <CardHeader>
            <div className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-green-400" />
              <CardTitle className="text-white">Share Invite Link</CardTitle>
            </div>
            <CardDescription className="text-gray-400">
              Share this link with anyone you want to invite to your workspace.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Input
                readOnly
                value="https://practicesmart.app/join?code=INVITE123"
                className="font-mono text-sm bg-white/10 border-white/20 text-white"
              />
              <Button variant="outline" size="icon" onClick={copyInviteLink} className="border-white/20 text-white hover:bg-white/20">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <div className="text-sm text-gray-400">
              <p>This link expires in 7 days. Anyone with this link can join your workspace.</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/20">
              Generate New Link
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card className="bg-black/40 border border-white/10 text-white">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-yellow-400" />
            <CardTitle className="text-white">Pending Invitations</CardTitle>
          </div>
          <CardDescription className="text-gray-400">
            Track the status of your sent invitations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table className="text-white">
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead className="text-white">Email</TableHead>
                <TableHead className="text-white">Role</TableHead>
                <TableHead className="text-white">Status</TableHead>
                <TableHead className="text-white">Date Sent</TableHead>
                <TableHead className="text-right text-white">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invites.map((invite, index) => (
                <TableRow key={index} className="border-white/10">
                  <TableCell>{invite.email}</TableCell>
                  <TableCell className="capitalize">{invite.role}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${invite.status === 'accepted' ? 'bg-green-600 text-green-100' : 'bg-yellow-600 text-yellow-100'}`}>
                      {invite.status}
                    </span>
                  </TableCell>
                  <TableCell>{invite.date}</TableCell>
                  <TableCell className="text-right">
                    {invite.status === 'pending' && (
                      <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                        Resend
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
