"use client";

import { AddUserDialog } from "./AddUserDialog";
import React, { useState } from "react";

export function AddUserDialogButton({
  children,
}: {
  children: React.JSX.Element;
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
      <div onClick={open}>{children}</div>
      <AddUserDialog {...{ isOpen, onClose }} />
    </>
  );
}
