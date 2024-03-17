"use client";

import { Spinner as NextUiSpinner, SpinnerProps } from "@nextui-org/react";
import clsx from "clsx";
import React from "react";
import { useCallback, useState } from "react";

interface UseSpinnerProps {
  initialState?: boolean;
  spinnerProps?: SpinnerProps;
  backgroundProps?: React.HTMLAttributes<HTMLDivElement>;
}

export function useRelativeWideSpinner(props: UseSpinnerProps = {}) {
  return useSpinner({
    backgroundProps: {
      className:
        "absolute w-full h-full bg-background opacity-50 z-50 flex justify-center z-50",
    },
    ...props,
  });
}

export function usePageWideSpinner(props: UseSpinnerProps = {}) {
  return useSpinner({
    backgroundProps: {
      className:
        "fixed top-0 left-0 w-full h-full bg-background opacity-50 flex justify-center z-50",
    },
    ...props,
  });
}

export function useSpinner({
  initialState = false,
  spinnerProps = {
    color: "primary",
    size: "lg",
  },
  backgroundProps = {},
}: UseSpinnerProps) {
  const [loading, setLoading] = useState(initialState);

  const Spinner = useCallback(
    () =>
      loading && (
        <div
          {...backgroundProps}
          className={clsx(backgroundProps.className)}
          onClick={(e) => {
            e.preventDefault();

            if (backgroundProps.onClick) {
              backgroundProps.onClick(e);
            }
          }}
          aria-disabled
        >
          <NextUiSpinner {...spinnerProps} />
        </div>
      ),
    [loading, backgroundProps, spinnerProps]
  );

  return {
    Spinner,
    loading,
    setLoading,
  };
}
