"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { GrLinkNext } from "react-icons/gr";
import { UpdateCompanyDto, updateCompany } from "./updateCompany";
import { Select, SelectItem } from "@nextui-org/react";
import { useTimezones } from "@/hooks/useTimezones";

export function Form({ companyId }: { companyId: string }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateCompanyDto>();
  const onSubmit: SubmitHandler<UpdateCompanyDto> = (dto) =>
    updateCompany(companyId, dto);

  const timezones = useTimezones();

  return (
    <div className="flex bg-zinc-200 w-dvw text-slate-800">
      <div className="flex bg-slate-800 w-[50dvw] h-dvh">
        <div className="m-auto text-4xl text-zinc-200">
          Welcome to <span className="font-bold text-5xl">Are You In</span>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full flex">
        <div className="flex h-dvh mx-auto">
          <div className="flex flex-col gap-3 my-auto w-[30dvw]">
            <input
              className="rounded px-2 py-1 outline-slate-800"
              {...register("companyName", {
                required: "Company Name is Required",
                minLength: 1,
              })}
              placeholder="Company Name"
            />

            <div className="flex justify-between w-full">
              <span className="font-bold pr-2 py-1">Notify at: </span>
              <input
                type="time"
                className="rounded px-2 py-1 outline-slate-800"
                defaultValue={"09:00"}
                {...register("pushNotificationsAt", {
                  required: "Notify At Time is Required",
                  minLength: 5,
                  maxLength: 5,
                })}
              />
            </div>

            <div className="flex justify-between w-full">
              <span className="font-bold pr-2 py-1">Auto-deny at: </span>
              <input
                type="time"
                className="rounded px-2 py-1 outline-slate-800"
                defaultValue={"10:00"}
                {...register("autoDenyAt", {
                  required: "Auto-deny At Time is Required",
                  minLength: 5,
                  maxLength: 5,
                })}
              />
            </div>

            <Select
              label="Timezone"
              defaultSelectedKeys={["GMT"]}
              {...register("timezone", { required: "Timezone is required" })}
            >
              {timezones.map((timezone) => (
                <SelectItem key={timezone}>{timezone}</SelectItem>
              ))}
            </Select>

            <div className="w-full">
              <button type="submit" className="float-left">
                <GrLinkNext className="my-auto hover:cursor-pointer" />
              </button>
            </div>

            {errors.companyName && (
              <p className="text-red-500 absolute bottom-4 right-4">
                {errors.companyName?.message}
              </p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
