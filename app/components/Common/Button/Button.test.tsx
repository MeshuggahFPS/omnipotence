import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Button } from "./Button";
import { ButtonSize } from "./Button.types";

describe("Button Component", () => {
  const testCases = [
    // Various combinations
    {
      primary: true,
      size: "small",
      backgroundColor: "#ff0",
      expectedClass: "button button--small button--primary",
    },
    {
      primary: true,
      size: "medium",
      backgroundColor: "#0f0",
      expectedClass: "button button--medium button--primary",
    },
    {
      primary: true,
      size: "large",
      backgroundColor: "#00f",
      expectedClass: "button button--large button--primary",
    },
    {
      primary: false,
      size: "small",
      backgroundColor: "#f00",
      expectedClass: "button button--small button--secondary",
    },
    {
      primary: false,
      size: "medium",
      backgroundColor: "#0ff",
      expectedClass: "button button--medium button--secondary",
    },
    {
      primary: false,
      size: "large",
      backgroundColor: "#f0f",
      expectedClass: "button button--large button--secondary",
    },

    // Default values
    {
      primary: false,
      size: undefined,
      backgroundColor: undefined,
      expectedClass: "button button--medium button--secondary",
    },
  ];

  testCases.forEach(({ primary, size, backgroundColor, expectedClass }) => {
    it(`renders correctly with primary=${primary}, size=${size}, backgroundColor=${backgroundColor}`, () => {
      render(
        <Button
          primary={primary}
          size={size as ButtonSize}
          backgroundColor={backgroundColor}
          label="Submit"
        />
      );
      const button = screen.getByText("Submit");
      expect(button).toHaveClass(expectedClass);
      if (backgroundColor)
        expect(button).toHaveStyle(`background-color: ${backgroundColor}`);
    });
  });

  it("calls onClick handler when clicked", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick} label="Submit" />);
    const button = screen.getByText("Submit");
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
