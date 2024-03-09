"use client";

import { Spinner, SpinnerProps } from "@nextui-org/react";
import clsx from "clsx";
import React from "react";
import { useCallback, useState } from "react";

interface UsePageWideSpinnerProps {
  initialState?: boolean;
  spinnerProps?: SpinnerProps;
  backgroundProps?: React.HTMLAttributes<HTMLDivElement>;
}

export function usePageWideSpinner({
  initialState = false,
  spinnerProps = {
    color: "primary",
    size: "lg",
  },
  backgroundProps = {},
}: UsePageWideSpinnerProps) {
  const [loading, setLoading] = useState(initialState);

  const PageWideSpinner = useCallback(
    () =>
      loading && (
        <div
          {...backgroundProps}
          className={clsx(
            "fixed top-0 left-0 w-full h-full bg-background opacity-50 flex justify-center z-50",
            backgroundProps.className
          )}
          onClick={(e) => {
            e.preventDefault();

            if (backgroundProps.onClick) {
              backgroundProps.onClick(e);
            }
          }}
          aria-disabled
        >
          <Spinner {...spinnerProps} />
        </div>
      ),
    [loading, backgroundProps, spinnerProps]
  );

  return {
    PageWideSpinner,
    loading,
    setLoading,
  };
}
