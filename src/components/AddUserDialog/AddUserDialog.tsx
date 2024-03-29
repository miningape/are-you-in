"use client";

import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAuthContext } from "@/app/(complete_profile)/AuthProvider";
import { inviteUser } from "./inviteUser";
import { USER_IN_ANOTHER_COMPANY_ERROR } from "./UserInAnotherCompanyError";
import toast from "react-hot-toast";
import { revalidatePath } from "next/cache";
import { revalidateClientPath } from "@/app/(complete_profile)/revalidateClientPath";

interface AddUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AddUserDialogFormValues {
  email: string;
  name: string;
}

export function AddUserDialog({ isOpen, onClose }: AddUserDialogProps) {
  const auth = useAuthContext();
  const cancelButtonRef = useRef(null);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<AddUserDialogFormValues>();
  const onSubmit = handleSubmit(async (form) => {
    try {
      await inviteUser(form.email, auth.user.company_id);
      await revalidateClientPath("/");
      onClose();
    } catch (e) {
      const error = e as Error;
      if (error.message === USER_IN_ANOTHER_COMPANY_ERROR) {
        toast.error("That email is already registered to another company!");
        return;
      }

      toast.error("Unknown error occurred");
    }
  });

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={onClose}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-zinc-900 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-slate-900 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <form onSubmit={onSubmit}>
                  <div className="bg-slate-900 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center sm:mx-0 sm:h-10 sm:w-10">
                        <ExclamationTriangleIcon
                          className="h-10 w-10 text-yellow-500"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-base font-semibold leading-6 text-zinc-300"
                        >
                          Add a new member
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-sm text-zinc-400 mb-2">
                            Are you sure you want to add a new member? All of
                            your data will be available to them
                          </p>

                          <input
                            className="rounded-md text-zinc-900 bg-zinc-300 px-1"
                            placeholder="Email"
                            type="email"
                            {...register("email", {
                              required: true,
                              validate: (email) =>
                                email.includes("@") &&
                                email.split("@").pop()?.includes("."),
                            })}
                          />
                        </div>
                        {errors.email !== undefined && (
                          <div className="text-red-600">
                            {errors.email.message ||
                              (errors.email.type === "validate" &&
                                "Emails must contain an @ and a .")}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-950 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="submit"
                      className="inline-flex w-full justify-center rounded-md bg-yellow-500 px-3 py-2 text-sm font-semibold text-zinc-200 shadow-sm hover:bg-yellow-400 sm:ml-3 sm:w-auto"
                    >
                      Invite
                    </button>
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-slate-950 px-3 py-2 text-sm font-semibold text-zinc-200 shadow-sm ring-1 ring-inset ring-zinc-300 hover:bg-slate-900 sm:mt-0 sm:w-auto"
                      onClick={onClose}
                      ref={cancelButtonRef}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
