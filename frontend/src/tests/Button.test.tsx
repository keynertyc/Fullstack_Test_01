import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/button";

describe("Button Component", () => {
  it("should render button with text", () => {
    // Arrange & Act
    render(<Button>Click me</Button>);

    // Assert
    expect(
      screen.getByRole("button", { name: /click me/i })
    ).toBeInTheDocument();
  });

  it("should apply default variant styles", () => {
    // Arrange & Act
    render(<Button>Default Button</Button>);

    // Assert
    const button = screen.getByRole("button");
    expect(button.className).toContain("bg-primary");
  });

  it("should apply outline variant styles", () => {
    // Arrange & Act
    render(<Button variant="outline">Outline Button</Button>);

    // Assert
    const button = screen.getByRole("button");
    expect(button.className).toContain("border");
  });

  it("should apply destructive variant styles", () => {
    // Arrange & Act
    render(<Button variant="destructive">Delete</Button>);

    // Assert
    const button = screen.getByRole("button");
    expect(button.className).toContain("bg-destructive");
  });

  it("should apply small size styles", () => {
    // Arrange & Act
    render(<Button size="sm">Small Button</Button>);

    // Assert
    const button = screen.getByRole("button");
    expect(button.className).toContain("h-9");
  });

  it("should be disabled when disabled prop is true", () => {
    // Arrange & Act
    render(<Button disabled>Disabled Button</Button>);

    // Assert
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });
});
