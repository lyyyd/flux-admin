"use client";

import { BookOpen, HelpCircle, MessageCircle, Search } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function HelpCenterPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Help Center</h1>
        <p className="text-muted-foreground">
          Find answers to common questions and get support
        </p>
      </div>

      <div className="relative">
        <Search className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
        <Input placeholder="Search for help articles..." className="pl-9" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <BookOpen className="text-primary mb-2 h-8 w-8" />
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>
              Learn the basics and set up your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-muted-foreground space-y-2 text-sm">
              <li>• Quick start guide</li>
              <li>• Account setup</li>
              <li>• First steps tutorial</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <HelpCircle className="text-primary mb-2 h-8 w-8" />
            <CardTitle>FAQs</CardTitle>
            <CardDescription>
              Answers to frequently asked questions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-muted-foreground space-y-2 text-sm">
              <li>• Account management</li>
              <li>• Billing & payments</li>
              <li>• Technical issues</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <MessageCircle className="text-primary mb-2 h-8 w-8" />
            <CardTitle>Contact Support</CardTitle>
            <CardDescription>
              Get in touch with our support team
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-muted-foreground space-y-2 text-sm">
              <li>• Live chat</li>
              <li>• Email support</li>
              <li>• Submit a ticket</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-muted-foreground text-sm">
          Full help center documentation and article system coming soon
        </p>
      </div>
    </div>
  );
}
