"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Settings, User, Bell, Shield, CreditCard } from "lucide-react";

export default function AccountPage() {
  const [name, setName] = useState("User Name");
  const [email, setEmail] = useState("user@example.com");
  
  return (
    <div className="container py-6 space-y-6 bg-black text-white">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Account Settings</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <Card className="md:w-80 h-fit bg-black/40 border border-white/10 text-white">
          <CardHeader>
            <div className="flex flex-col items-center space-y-3">
              <Avatar className="h-24 w-24 border-2 border-white/20">
                <AvatarImage src="/placeholder.svg" alt="Profile" />
                <AvatarFallback className="bg-blue-600 text-white">UN</AvatarFallback>
              </Avatar>
              <div className="space-y-1 text-center">
                <h2 className="text-xl font-semibold text-white">{name}</h2>
                <p className="text-sm text-gray-400">{email}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start border-white/20 text-white hover:bg-white/20">
                <User className="mr-2 h-4 w-4 text-blue-400" />
                Profile
              </Button>
              <Button variant="outline" className="w-full justify-start border-white/20 text-white hover:bg-white/20">
                <Bell className="mr-2 h-4 w-4 text-yellow-400" />
                Notifications
              </Button>
              <Button variant="outline" className="w-full justify-start border-white/20 text-white hover:bg-white/20">
                <Shield className="mr-2 h-4 w-4 text-green-400" />
                Privacy
              </Button>
              <Button variant="outline" className="w-full justify-start border-white/20 text-white hover:bg-white/20">
                <CreditCard className="mr-2 h-4 w-4 text-purple-400" />
                Billing
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex-1">
          <Tabs defaultValue="profile">
            <TabsList className="bg-black/40 border border-white/10">
              <TabsTrigger value="profile" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Profile</TabsTrigger>
              <TabsTrigger value="notifications" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Notifications</TabsTrigger>
              <TabsTrigger value="privacy" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Privacy</TabsTrigger>
              <TabsTrigger value="billing" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Billing</TabsTrigger>
            </TabsList>
            <TabsContent value="profile" className="space-y-4">
              <Card className="bg-black/40 border border-white/10 text-white">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-400" />
                    <CardTitle className="text-white">Profile Information</CardTitle>
                  </div>
                  <CardDescription className="text-gray-400">
                    Update your account profile information and email address.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white">Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">Save Changes</Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>
                    Update your password to maintain account security.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Update Password</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="notifications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>
                    Configure how and when you receive notifications.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive email notifications for important updates</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Team Invitations</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications when invited to a team</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Activity Comments</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications when someone comments on your activities</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Save Preferences</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="privacy" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                  <CardDescription>
                    Control your privacy and data sharing preferences.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Default Activity Privacy</Label>
                      <p className="text-sm text-muted-foreground">Set the default privacy level for new activities</p>
                    </div>
                    <div className="w-[180px]">
                      <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                        <option value="private">Private</option>
                        <option value="team">Team</option>
                        <option value="public">Public</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Profile Visibility</Label>
                      <p className="text-sm text-muted-foreground">Control who can see your profile information</p>
                    </div>
                    <div className="w-[180px]">
                      <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                        <option value="everyone">Everyone</option>
                        <option value="teams">Team Members Only</option>
                        <option value="private">Private</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Save Privacy Settings</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="billing" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Subscription Plan</CardTitle>
                  <CardDescription>
                    Manage your subscription and billing information.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Pro Plan</h3>
                          <p className="text-sm text-muted-foreground">$9.99/month</p>
                        </div>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Active
                        </Badge>
                      </div>
                      <div className="mt-4 text-sm text-muted-foreground">
                        <p>Your next billing date is June 29, 2025</p>
                      </div>
                    </div>
                    <Button variant="outline">Manage Subscription</Button>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>
                    Manage your payment methods and billing address.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="h-10 w-16 rounded-md bg-gray-100 flex items-center justify-center">
                            <CreditCard className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="font-medium">u2022u2022u2022u2022 u2022u2022u2022u2022 u2022u2022u2022u2022 4242</h3>
                            <p className="text-sm text-muted-foreground">Expires 12/2026</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          Default
                        </Badge>
                      </div>
                    </div>
                    <Button variant="outline">Add Payment Method</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
