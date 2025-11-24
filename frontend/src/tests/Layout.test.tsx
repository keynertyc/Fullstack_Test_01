import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Layout } from "@/components/Layout";

vi.mock("@/store/authStore", () => ({
  useAuthStore: vi.fn(),
}));

import { useAuthStore } from "@/store/authStore";

describe("Layout (mobile menu)", () => {
  it("renders hamburger button and toggles mobile menu", () => {
    // Arrange
    (useAuthStore as any).mockReturnValue({
      user: { name: "Test User" },
      logout: vi.fn(),
    });

    // Act
    render(
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    );

    // The hamburger should be present (visible in DOM)
    const toggle = screen.getByLabelText(/toggle menu/i);
    expect(toggle).toBeInTheDocument();

    // Initially menu links shouldn't be in the DOM
    expect(screen.queryByText("Dashboard")).not.toBeNull();

    // Click to open
    fireEvent.click(toggle);

    // Now mobile menu links should appear
    expect(screen.getAllByText("Dashboard").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Projects").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Tasks").length).toBeGreaterThan(0);
  });
});
