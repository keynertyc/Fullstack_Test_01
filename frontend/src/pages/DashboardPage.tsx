import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Statistics } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart3,
  CheckCircle,
  Clock,
  FolderKanban,
  ListTodo,
  Users,
} from "lucide-react";

export function DashboardPage() {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      const response = await api.getStatistics();
      setStats(response.data!);
    } catch (error) {
      console.error("Failed to load statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">Loading...</div>
    );
  }

  if (!stats) {
    return <div>Failed to load statistics</div>;
  }

  const completionRate =
    stats.total_tasks > 0
      ? Math.round((stats.tasks_by_status.completed / stats.total_tasks) * 100)
      : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your projects and tasks
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Projects
            </CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_projects}</div>
            <p className="text-xs text-muted-foreground">
              {stats.owned_projects} owned, {stats.collaborating_projects}{" "}
              collaborating
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <ListTodo className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_tasks}</div>
            <p className="text-xs text-muted-foreground">
              {stats.tasks_assigned_to_me} assigned to you
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.tasks_by_status.completed}
            </div>
            <p className="text-xs text-muted-foreground">
              {completionRate}% completion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.tasks_by_status.in_progress}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.tasks_by_status.pending} pending
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tasks by Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Pending</span>
                <span className="text-sm text-muted-foreground">
                  {stats.tasks_by_status.pending}
                </span>
              </div>
              <div className="h-2 rounded-full bg-secondary">
                <div
                  className="h-2 rounded-full bg-yellow-500"
                  style={{
                    width:
                      stats.total_tasks > 0
                        ? `${
                            (stats.tasks_by_status.pending /
                              stats.total_tasks) *
                            100
                          }%`
                        : "0%",
                  }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">In Progress</span>
                <span className="text-sm text-muted-foreground">
                  {stats.tasks_by_status.in_progress}
                </span>
              </div>
              <div className="h-2 rounded-full bg-secondary">
                <div
                  className="h-2 rounded-full bg-blue-500"
                  style={{
                    width:
                      stats.total_tasks > 0
                        ? `${
                            (stats.tasks_by_status.in_progress /
                              stats.total_tasks) *
                            100
                          }%`
                        : "0%",
                  }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Completed</span>
                <span className="text-sm text-muted-foreground">
                  {stats.tasks_by_status.completed}
                </span>
              </div>
              <div className="h-2 rounded-full bg-secondary">
                <div
                  className="h-2 rounded-full bg-green-500"
                  style={{
                    width:
                      stats.total_tasks > 0
                        ? `${
                            (stats.tasks_by_status.completed /
                              stats.total_tasks) *
                            100
                          }%`
                        : "0%",
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activity Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Projects you own</span>
              </div>
              <span className="text-sm font-medium">
                {stats.owned_projects}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderKanban className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Collaborating projects</span>
              </div>
              <span className="text-sm font-medium">
                {stats.collaborating_projects}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ListTodo className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Tasks created by you</span>
              </div>
              <span className="text-sm font-medium">
                {stats.tasks_created_by_me}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Tasks assigned to you</span>
              </div>
              <span className="text-sm font-medium">
                {stats.tasks_assigned_to_me}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
