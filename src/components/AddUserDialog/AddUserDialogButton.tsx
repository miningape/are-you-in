"use client";

import { Button } from "@nextui-org/react";
import { AddUserDialog } from "./AddUserDialog";
import React, { useState } from "react";

export function AddUserDialogButton({
  children = <>Add a new member</>,
}: {
  children?: React.JSX.Element;
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
        className="absolute -top-0 mt-16 right-0 mr-5"
        onClick={open}
      >
        {children}
      </Button>
      <AddUserDialog {...{ isOpen, onClose }} />
    </>
  );
}
