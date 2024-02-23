"use client";

import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import React, { Fragment, useRef, useState } from "react";
import { deleteUser } from "./deleteUser";
import toast from "react-hot-toast";

interface DeleteUserDialogProps {
  isOpen: boolean;
  name: string | null;
  userId: string;
  onClose: () => void;
}

export function DeleteUserDialogButton({
  children,
  userId,
  name,
}: Pick<DeleteUserDialogProps, "userId" | "name"> & {
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
      <div onClick={open} className="inline">
        {children}
      </div>
      <DeleteUserDialog {...{ isOpen, onClose, userId, name }} />
    </>
  );
}

export function DeleteUserDialog({
  userId,
  isOpen,
  onClose,
  name,
}: DeleteUserDialogProps) {
  const cancelButtonRef = useRef(null);

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
                <div className="bg-slate-900 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center sm:mx-0 sm:h-10 sm:w-10">
                      <ExclamationTriangleIcon
                        className="h-10 w-10 text-red-500"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-zinc-300"
                      >
                        Delete {name ?? "a user"}
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-zinc-400 mb-2">
                          Are you sure you want to delete this user? All their
                          data will remain available to you but they will no
                          longer have access to the system
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-950 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    onClick={() => {
                      try {
                        deleteUser(userId);
                      } catch (e) {
                        console.error(e);
                        toast.error("Could not delete user");
                      } finally {
                        onClose();
                      }
                    }}
                    className="inline-flex w-full justify-center rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-zinc-200 shadow-sm hover:bg-red-400 sm:ml-3 sm:w-auto"
                  >
                    Delete
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
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

/*
 5 - 10%
 4 - 22.5%
 3 - 22.5%
 2 - 22.5%
 1 - 22.5%
 rest - 90% / 4
 
 no repetitions after 2 in a row
 no repeated overall

*/

function getRandomFloat(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

const getRandom = () => getRandomFloat(0, 100);

const PROBABILITY_ARRAY = [22.5, 22.5, 22.5, 22.5, 10];

function verifyProbabilityList(probabilityList: number[]): boolean {
  return probabilityList.reduce((acc, cur) => acc + cur, 0) == 100;
}

function removeIndexFromProbabilityList(
  probabilityList: number[],
  index: number
): number[] {
  const probabilityOfRemovedIndex = probabilityList[index];
  const distributedProbability =
    probabilityOfRemovedIndex / (probabilityList.length - 1);
  const addDistributedProbability = (probability: number) =>
    distributedProbability + probability;

  const newList = probabilityList
    .slice(0, index)
    .map(addDistributedProbability);
  const rest = probabilityList.slice(index + 1).map(addDistributedProbability);

  newList.push(0);
  newList.push(...rest);

  return newList;
}

function getRandomsNoRepeats(
  probabilityList: number[],
  length: number
): number[] {
  const randomList: number[] = [];

  for (let i = 0; i < length; i++) {
    if (i === 0) {
      randomList.push(getRandomByProbability(probabilityList));
      continue;
    }

    const lastRandomValue = randomList[randomList.length - 1];
    const probabilityListWithoutLastValue = removeIndexFromProbabilityList(
      probabilityList,
      lastRandomValue
    );
    randomList.push(getRandomByProbability(probabilityListWithoutLastValue));
  }

  return randomList;
}

function getRandomByProbability(probabilityList: number[]): number {
  let cast = getRandom();

  for (let index = 0; index < probabilityList.length; index++) {
    const probability = probabilityList[index];
    cast -= probability;

    if (cast < 0) {
      return index;
    }
  }

  throw new Error("Out of bounds error!!");
}
