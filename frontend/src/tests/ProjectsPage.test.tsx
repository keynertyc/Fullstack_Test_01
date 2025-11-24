import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { ProjectsPage } from "@/pages/ProjectsPage";
import { useProjectStore } from "@/store/projectStore";

// Mock the project store
vi.mock("@/store/projectStore", () => ({
  useProjectStore: vi.fn(),
}));

describe("ProjectsPage", () => {
  it("should display loading state when projects are loading", () => {
    // Arrange
    vi.mocked(useProjectStore).mockReturnValue({
      projects: [],
      pagination: null,
      isLoading: true,
      fetchProjects: vi.fn(),
      deleteProject: vi.fn(),
      createProject: vi.fn(),
      updateProject: vi.fn(),
    });

    // Act
    render(
      <BrowserRouter>
        <ProjectsPage />
      </BrowserRouter>
    );

    // Assert
    expect(screen.getByText("Loading projects...")).toBeInTheDocument();
  });

  it("should display projects when loaded", async () => {
    // Arrange
    const mockProjects = [
      {
        id: 1,
        name: "Test Project 1",
        description: "Description 1",
        owner_id: 1,
        owner_name: "John Doe",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
      },
      {
        id: 2,
        name: "Test Project 2",
        description: "Description 2",
        owner_id: 1,
        owner_name: "Jane Smith",
        created_at: "2024-01-02T00:00:00Z",
        updated_at: "2024-01-02T00:00:00Z",
      },
    ];

    vi.mocked(useProjectStore).mockReturnValue({
      projects: mockProjects,
      pagination: { page: 1, limit: 10, total: 2, total_pages: 1 },
      isLoading: false,
      fetchProjects: vi.fn(),
      deleteProject: vi.fn(),
      createProject: vi.fn(),
      updateProject: vi.fn(),
    });

    // Act
    render(
      <BrowserRouter>
        <ProjectsPage />
      </BrowserRouter>
    );

    // Assert
    await waitFor(() => {
      expect(screen.getByText("Test Project 1")).toBeInTheDocument();
      expect(screen.getByText("Test Project 2")).toBeInTheDocument();
      expect(screen.getByText("Owner: John Doe")).toBeInTheDocument();
      expect(screen.getByText("Owner: Jane Smith")).toBeInTheDocument();
    });
  });

  it("should display empty state when no projects exist", () => {
    // Arrange
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
        <ProjectsPage />
      </BrowserRouter>
    );

    // Assert
    expect(
      screen.getByText("No projects yet. Create your first project!")
    ).toBeInTheDocument();
  });

  it("should render New Project button", () => {
    // Arrange
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
        <ProjectsPage />
      </BrowserRouter>
    );

    // Assert
    expect(
      screen.getByRole("button", { name: /new project/i })
    ).toBeInTheDocument();
  });

  it("should display pagination controls when multiple pages exist", () => {
    // Arrange
    const mockProjects = [
      {
        id: 1,
        name: "Project 1",
        description: "Desc",
        owner_id: 1,
        owner_name: "Owner",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
      },
    ];

    vi.mocked(useProjectStore).mockReturnValue({
      projects: mockProjects,
      pagination: { page: 1, limit: 10, total: 25, total_pages: 3 },
      isLoading: false,
      fetchProjects: vi.fn(),
      deleteProject: vi.fn(),
      createProject: vi.fn(),
      updateProject: vi.fn(),
    });

    // Act
    render(
      <BrowserRouter>
        <ProjectsPage />
      </BrowserRouter>
    );

    // Assert
    expect(screen.getByText("Page 1 of 3")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /previous/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();
  });
});
