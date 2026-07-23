import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/button";

describe("<Button />", () => {
  it("renders a native button by default", () => {
    render(<Button>Explore the Collection</Button>);
    const button = screen.getByRole("button", { name: "Explore the Collection" });
    expect(button.tagName).toBe("BUTTON");
  });

  it("applies the primary variant by default", () => {
    render(<Button>Shop Now</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-ink");
  });

  it("applies the requested variant and size", () => {
    render(
      <Button variant="outline" size="lg">
        View Details
      </Button>
    );
    const button = screen.getByRole("button");
    expect(button).toHaveClass("border");
    expect(button).toHaveClass("h-14");
  });

  it("renders its child element directly when asChild is set, without wrapping in a <button>", () => {
    render(
      <Button asChild>
        <a href="/shop">Shop the Collection</a>
      </Button>
    );
    const link = screen.getByRole("link", { name: "Shop the Collection" });
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/shop");
  });

  it("still renders an <a>, not a nested <button>, when asChild and magnetic are combined", () => {
    render(
      <Button asChild magnetic>
        <a href="/shop">Explore the Collection</a>
      </Button>
    );
    const link = screen.getByRole("link", { name: "Explore the Collection" });
    expect(link.tagName).toBe("A");
    expect(link.querySelector("button")).toBeNull();
  });

  it("disables the button and applies disabled styling", () => {
    render(<Button disabled>Sold Out</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
