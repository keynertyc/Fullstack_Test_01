import { useState, useEffect } from "react";
import { Project, Collaborator } from "@/types";
import { api } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { UserPlus, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

interface CollaboratorsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project | null;
}

export function CollaboratorsDialog({
  open,
  onOpenChange,
  project,
}: CollaboratorsDialogProps) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [userId, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open && project) {
      loadCollaborators();
    }
  }, [open, project]);

  const loadCollaborators = async () => {
    if (!project) return;

    try {
      setIsLoading(true);
      const response = await api.getCollaborators(project.id);
      setCollaborators(response.data || []);
    } catch (error) {
      toast.error("Failed to load collaborators");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCollaborator = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project || !userId.trim()) return;

    const userIdNum = parseInt(userId);
    if (isNaN(userIdNum)) {
      toast.error("Invalid user ID");
      return;
    }

    try {
      setIsLoading(true);
      await api.addCollaborator(project.id, userIdNum);
      toast.success("Collaborator added successfully");
      setUserId("");
      loadCollaborators();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to add collaborator"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveCollaborator = async (collaboratorId: number) => {
    if (!project) return;
    if (!confirm("Are you sure you want to remove this collaborator?")) return;

    try {
      setIsLoading(true);
      await api.removeCollaborator(project.id, collaboratorId);
      toast.success("Collaborator removed successfully");
      loadCollaborators();
    } catch (error) {
      toast.error("Failed to remove collaborator");
    } finally {
      setIsLoading(false);
    }
  };

  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Manage Collaborators</DialogTitle>
          <DialogDescription>
            Add or remove collaborators for "{project.name}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <form onSubmit={handleAddCollaborator} className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="userId" className="sr-only">
                User ID
              </Label>
              <Input
                id="userId"
                type="number"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Enter user ID"
                disabled={isLoading}
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add
            </Button>
          </form>

          <div className="space-y-2">
            <Label>Current Collaborators ({collaborators.length})</Label>
            {isLoading && collaborators.length === 0 ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : collaborators.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No collaborators yet
              </p>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {collaborators.map((collaborator) => (
                  <Card key={collaborator.id}>
                    <CardContent className="flex items-center justify-between p-4">
                      <div>
                        <p className="font-medium">{collaborator.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {collaborator.email}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Added:{" "}
                          {new Date(collaborator.added_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleRemoveCollaborator(collaborator.id)
                        }
                        disabled={isLoading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
