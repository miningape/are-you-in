"use client";

import { Button } from "@nextui-org/react";
import { AddUserDialog } from "./AddUserDialog";
import React, { useState } from "react";

export function AddUserDialogButton({
  children = <>Add a new member</>,
  className = "",
}: {
  children?: React.JSX.Element;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  function open() {
    setIsOpen(true);
  }

  function onClose() {
    setIsOpen(false);
  }

  return (
    <>
      <Button
        color="warning"
        variant="ghost"
        className={className}
        onClick={open}
      >
        {children}
      </Button>
      <AddUserDialog {...{ isOpen, onClose }} />
    </>
  );
}
