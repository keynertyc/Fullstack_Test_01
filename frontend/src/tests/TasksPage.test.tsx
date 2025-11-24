import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { TasksPage } from "@/pages/TasksPage";
import { useTaskStore } from "@/store/taskStore";
import { useProjectStore } from "@/store/projectStore";

// Mock the stores
vi.mock("@/store/taskStore", () => ({
  useTaskStore: vi.fn(),
}));

vi.mock("@/store/projectStore", () => ({
  useProjectStore: vi.fn(),
}));

describe("TasksPage", () => {
  it("should display loading state when tasks are loading", () => {
    // Arrange
    vi.mocked(useTaskStore).mockReturnValue({
      tasks: [],
      pagination: null,
      isLoading: true,
      fetchTasks: vi.fn(),
      deleteTask: vi.fn(),
      createTask: vi.fn(),
      updateTask: vi.fn(),
    });

    vi.mocked(useProjectStore).mockReturnValue({
      projects: [],
      pagination: null,
      isLoading: false,
      fetchProjects: vi.fn(),
      deleteProject: vi.fn(),
      createProject: vi.fn(),
      updateProject: vi.fn(),
    });

    // Act
    render(
      <BrowserRouter>
        <TasksPage />
      </BrowserRouter>
    );

    // Assert
    expect(screen.getByText("Loading tasks...")).toBeInTheDocument();
  });

  it("should display tasks when loaded", async () => {
    // Arrange
    const mockTasks = [
      {
        id: 1,
        title: "Task 1",
        description: "Description 1",
        status: "pending",
        priority: "high",
        project_id: 1,
        project_name: "Project Alpha",
        assigned_to: 2,
        assigned_to_name: "John Doe",
        created_by: 1,
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
      },
      {
        id: 2,
        title: "Task 2",
        description: "Description 2",
        status: "in_progress",
        priority: "medium",
        project_id: 1,
        project_name: "Project Beta",
        assigned_to: 3,
        assigned_to_name: "Jane Smith",
        created_by: 1,
        created_at: "2024-01-02T00:00:00Z",
        updated_at: "2024-01-02T00:00:00Z",
      },
    ];

    vi.mocked(useTaskStore).mockReturnValue({
      tasks: mockTasks,
      pagination: { page: 1, limit: 10, total: 2, total_pages: 1 },
      isLoading: false,
      fetchTasks: vi.fn(),
      deleteTask: vi.fn(),
      createTask: vi.fn(),
      updateTask: vi.fn(),
    });

    vi.mocked(useProjectStore).mockReturnValue({
      projects: [],
      pagination: null,
      isLoading: false,
      fetchProjects: vi.fn(),
      deleteProject: vi.fn(),
      createProject: vi.fn(),
      updateProject: vi.fn(),
    });

    // Act
    render(
      <BrowserRouter>
        <TasksPage />
      </BrowserRouter>
    );

    // Assert
    await waitFor(() => {
      expect(screen.getByText("Task 1")).toBeInTheDocument();
      expect(screen.getByText("Task 2")).toBeInTheDocument();
      expect(screen.getByText("Project: Project Alpha")).toBeInTheDocument();
      expect(screen.getByText("Project: Project Beta")).toBeInTheDocument();
    });
  });

  it("should display status badges correctly", async () => {
    // Arrange
    const mockTasks = [
      {
        id: 1,
        title: "Pending Task",
        description: "Test",
        status: "pending",
        priority: "low",
        project_id: 1,
        project_name: "Project",
        assigned_to: null,
        assigned_to_name: null,
        created_by: 1,
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
      },
    ];

    vi.mocked(useTaskStore).mockReturnValue({
      tasks: mockTasks,
      pagination: null,
      isLoading: false,
      fetchTasks: vi.fn(),
      deleteTask: vi.fn(),
      createTask: vi.fn(),
      updateTask: vi.fn(),
    });

    vi.mocked(useProjectStore).mockReturnValue({
      projects: [],
      pagination: null,
      isLoading: false,
      fetchProjects: vi.fn(),
      deleteProject: vi.fn(),
      createProject: vi.fn(),
      updateProject: vi.fn(),
    });

    // Act
    render(
      <BrowserRouter>
        <TasksPage />
      </BrowserRouter>
    );

    // Assert
    await waitFor(() => {
      expect(screen.getByText("pending")).toBeInTheDocument();
      expect(screen.getByText("low")).toBeInTheDocument();
    });
  });

  it("should display empty state when no tasks exist", () => {
    // Arrange
    vi.mocked(useTaskStore).mockReturnValue({
      tasks: [],
      pagination: null,
      isLoading: false,
      fetchTasks: vi.fn(),
      deleteTask: vi.fn(),
      createTask: vi.fn(),
      updateTask: vi.fn(),
    });

    vi.mocked(useProjectStore).mockReturnValue({
      projects: [],
      pagination: null,
      isLoading: false,
      fetchProjects: vi.fn(),
      deleteProject: vi.fn(),
      createProject: vi.fn(),
      updateProject: vi.fn(),
    });

    // Act
    render(
      <BrowserRouter>
        <TasksPage />
      </BrowserRouter>
    );

    // Assert
    expect(
      screen.getByText("No tasks yet. Create your first task!")
    ).toBeInTheDocument();
  });

  it("should render Filters button", () => {
    // Arrange
    vi.mocked(useTaskStore).mockReturnValue({
      tasks: [],
      pagination: null,
      isLoading: false,
      fetchTasks: vi.fn(),
      deleteTask: vi.fn(),
      createTask: vi.fn(),
      updateTask: vi.fn(),
    });

    vi.mocked(useProjectStore).mockReturnValue({
      projects: [],
      pagination: null,
      isLoading: false,
      fetchProjects: vi.fn(),
      deleteProject: vi.fn(),
      createProject: vi.fn(),
      updateProject: vi.fn(),
    });

    // Act
    render(
      <BrowserRouter>
        <TasksPage />
      </BrowserRouter>
    );

    // Assert
    expect(
      screen.getByRole("button", { name: /filters/i })
    ).toBeInTheDocument();
  });
});
