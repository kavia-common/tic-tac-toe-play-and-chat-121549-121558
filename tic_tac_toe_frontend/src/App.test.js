import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders app header brand", () => {
  render(<App />);
  const header = screen.getByText(/Tic/i);
  expect(header).toBeInTheDocument();
});
