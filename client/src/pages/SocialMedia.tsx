
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, Settings } from 'lucide-react';

const SocialMedia = () => {
  return (
    <div className="p-6">
      <div className="flex items-center justify-center min-h-[60vh] w-full">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Settings className="h-16 w-16 text-muted-foreground" />
                <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-1">
                  <Clock className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>
            <CardTitle className="text-2xl">Social Media Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-lg text-muted-foreground">
                Coming Soon
              </p>
              <p className="text-sm text-muted-foreground">
                We're working on comprehensive social media management features including:
              </p>
              <div className="text-left space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Content scheduling and calendar</span>
                </div>
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  <span>Multi-platform account management</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Analytics and engagement tracking</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SocialMedia;
