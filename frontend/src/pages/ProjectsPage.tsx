import { useEffect, useState } from "react";
import { useProjectStore } from "@/store/projectStore";
import { Project } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Edit, Trash2, Users } from "lucide-react";
import { ProjectDialog } from "@/components/ProjectDialog";
import { CollaboratorsDialog } from "@/components/CollaboratorsDialog";
import { toast } from "react-toastify";

export function ProjectsPage() {
  const { projects, pagination, isLoading, fetchProjects, deleteProject } =
    useProjectStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCollaboratorsOpen, setIsCollaboratorsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const loadProjects = () => {
    fetchProjects(currentPage, 10);
  };

  useEffect(() => {
    loadProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (project: Project) => {
    if (!confirm(`Are you sure you want to delete "${project.name}"?`)) return;

    try {
      await deleteProject(project.id);
      toast.success("Project deleted successfully");
      loadProjects();
    } catch (error) {
      toast.error("Failed to delete project");
    }
  };

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setIsEditOpen(true);
  };

  const handleManageCollaborators = (project: Project) => {
    setSelectedProject(project);
    setIsCollaboratorsOpen(true);
  };

  const handleSuccess = () => {
    // Reset to page 1 when creating a new project to see it immediately
    setCurrentPage(1);
    loadProjects();
    setIsCreateOpen(false);
    setIsEditOpen(false);
    setSelectedProject(null);
  };

  if (isLoading && projects.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        Loading projects...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">
            Manage your projects and collaborators
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredProjects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">
              {searchTerm
                ? "No projects found"
                : "No projects yet. Create your first project!"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <Card
                key={project.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="line-clamp-1">
                        {project.name}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        Owner: {project.owner_name}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {project.description || "No description"}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleManageCollaborators(project)}
                    >
                      <Users className="mr-2 h-4 w-4" />
                      Collaborators
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(project)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(project)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="mt-4 text-xs text-muted-foreground">
                    Created: {new Date(project.created_at).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {pagination && pagination.total_pages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {pagination.total_pages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((p) => Math.min(pagination.total_pages, p + 1))
                }
                disabled={currentPage === pagination.total_pages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      <ProjectDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSuccess={handleSuccess}
      />

      <ProjectDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        project={selectedProject}
        onSuccess={handleSuccess}
      />

      <CollaboratorsDialog
        open={isCollaboratorsOpen}
        onOpenChange={setIsCollaboratorsOpen}
        project={selectedProject}
      />
    </div>
  );
}
