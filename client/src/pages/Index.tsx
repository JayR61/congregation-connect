
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="container max-w-6xl mx-auto py-10 px-4 sm:px-6">
      <div className="flex flex-col items-center justify-center text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
          Welcome to your Church Management System
        </h1>
        <p className="mt-4 text-xl text-muted-foreground max-w-3xl">
          Efficiently manage your church programmes, members, finances, and more with our integrated platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Manage Programmes</CardTitle>
            <CardDescription>
              Create and track church programmes, manage attendance, and collect feedback.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/programmes')} className="w-full">
              Go to Programmes
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Member Management</CardTitle>
            <CardDescription>
              Keep track of church members, their details, and involvement.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/members')} className="w-full">
              Go to Members
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Document Center</CardTitle>
            <CardDescription>
              Store, organize, and share important church documents.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/documents')} className="w-full">
              Go to Documents
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financial Management</CardTitle>
            <CardDescription>
              Track donations, expenses, and financial records.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/finance')} className="w-full">
              Go to Finance
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Task Management</CardTitle>
            <CardDescription>
              Assign and track tasks for church activities and events.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/tasks')} className="w-full">
              Go to Tasks
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dashboard</CardTitle>
            <CardDescription>
              Get an overview of all church activities and metrics.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/dashboard')} className="w-full">
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
