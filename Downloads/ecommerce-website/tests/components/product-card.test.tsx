import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProductCard from "@/components/ProductCard";
import { CartProvider, useCart } from "@/context/CartContext";
import { getProductBySlug } from "@/lib/products";

const available = getProductBySlug("amber-horizon-vessel")!;
const sold = getProductBySlug("monolith-study-no-3")!;

function CartItemCount() {
  const { itemCount } = useCart();
  return <span data-testid="item-count">{itemCount}</span>;
}

function renderWithCart(children: ReactNode) {
  return render(
    <CartProvider>
      {children}
      <CartItemCount />
    </CartProvider>
  );
}

describe("<ProductCard />", () => {
  it("renders the title, dimensions, and formatted price", () => {
    renderWithCart(<ProductCard product={available} index={0} />);
    expect(screen.getByText("Amber Horizon Vessel")).toBeInTheDocument();
    expect(screen.getByText(available.dimensions)).toBeInTheDocument();
    expect(screen.getByText("$480")).toBeInTheDocument();
  });

  it("links to the product detail page", () => {
    renderWithCart(<ProductCard product={available} index={0} />);
    const detailLink = screen.getByRole("link", {
      name: `View details for ${available.title}`,
    });
    expect(detailLink).toHaveAttribute("href", `/shop/${available.slug}`);
  });

  it("shows a 'Sold' badge and hides the add-to-cart control for sold pieces", () => {
    renderWithCart(<ProductCard product={sold} index={0} />);
    expect(screen.getByText("Sold")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: `Add ${sold.title} to cart` })
    ).not.toBeInTheDocument();
  });

  it("adds the product to the cart when the add button is clicked", async () => {
    const user = userEvent.setup();
    renderWithCart(<ProductCard product={available} index={0} />);

    await user.click(screen.getByRole("button", { name: `Add ${available.title} to cart` }));

    expect(screen.getByTestId("item-count").textContent).toBe("1");
  });
});
