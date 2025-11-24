import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "@/components/ui/badge";

describe("Badge Component", () => {
  it("should render badge with text", () => {
    // Arrange & Act
    render(<Badge>New</Badge>);

    // Assert
    expect(screen.getByText("New")).toBeInTheDocument();
  });

  it("should apply default variant styles", () => {
    // Arrange & Act
    render(<Badge>Default</Badge>);

    // Assert
    const badge = screen.getByText("Default");
    expect(badge.className).toContain("bg-primary");
  });

  it("should apply secondary variant styles", () => {
    // Arrange & Act
    render(<Badge variant="secondary">Secondary</Badge>);

    // Assert
    const badge = screen.getByText("Secondary");
    expect(badge.className).toContain("bg-secondary");
  });

  it("should apply destructive variant styles", () => {
    // Arrange & Act
    render(<Badge variant="destructive">Error</Badge>);

    // Assert
    const badge = screen.getByText("Error");
    expect(badge.className).toContain("bg-destructive");
  });

  it("should apply outline variant styles", () => {
    // Arrange & Act
    render(<Badge variant="outline">Outline</Badge>);

    // Assert
    const badge = screen.getByText("Outline");
    expect(badge.className).toContain("text-foreground");
  });
});
