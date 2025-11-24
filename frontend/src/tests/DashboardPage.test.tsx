import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { DashboardPage } from "@/pages/DashboardPage";
import { api } from "@/lib/api";

// Mock the API
vi.mock("@/lib/api", () => ({
  api: {
    getStatistics: vi.fn(),
  },
}));

describe("DashboardPage", () => {
  it("should render loading state initially", () => {
    // Arrange
    vi.mocked(api.getStatistics).mockImplementation(
      () => new Promise(() => {})
    );

    // Act
    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    );

    // Assert
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("should display statistics when data is loaded", async () => {
    // Arrange
    const mockStats = {
      total_projects: 5,
      owned_projects: 3,
      collaborating_projects: 2,
      total_tasks: 10,
      tasks_by_status: {
        pending: 3,
        in_progress: 4,
        completed: 3,
      },
      tasks_assigned_to_me: 5,
      tasks_created_by_me: 8,
    };

    vi.mocked(api.getStatistics).mockResolvedValue({
      success: true,
      message: "Success",
      data: mockStats,
    });

    // Act
    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    );

    // Assert
    await waitFor(() => {
      expect(screen.getByText("Dashboard")).toBeInTheDocument();
      expect(screen.getByText("Total Projects")).toBeInTheDocument();
      expect(screen.getByText("3 owned, 2 collaborating")).toBeInTheDocument();
      expect(screen.getByText("Total Tasks")).toBeInTheDocument();
    });
  });

  it("should display task status breakdown", async () => {
    // Arrange
    const mockStats = {
      total_projects: 2,
      owned_projects: 2,
      collaborating_projects: 0,
      total_tasks: 10,
      tasks_by_status: {
        pending: 2,
        in_progress: 3,
        completed: 5,
      },
      tasks_assigned_to_me: 5,
      tasks_created_by_me: 10,
    };

    vi.mocked(api.getStatistics).mockResolvedValue({
      success: true,
      message: "Success",
      data: mockStats,
    });

    // Act
    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    );

    // Assert
    await waitFor(() => {
      expect(screen.getAllByText("Completed").length).toBeGreaterThan(0);
      expect(screen.getAllByText("In Progress").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Pending").length).toBeGreaterThan(0);
    });
  });
});
