"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { GrLinkNext } from "react-icons/gr";
import { UpdateCompanyDto, updateCompany } from "./updateCompany";
import { Input, Select, SelectItem } from "@nextui-org/react";
import { useTimezones } from "@/hooks/useTimezones";
import { usePageWideSpinner } from "@/hooks/usePageWideSpinner";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function Form({ companyId }: { companyId: string }) {
  const { PageWideSpinner, setLoading } = usePageWideSpinner({});
  const { push } = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateCompanyDto>();
  const onSubmit: SubmitHandler<UpdateCompanyDto> = async (dto) => {
    setLoading(true);
    await updateCompany(companyId, dto);
    push("/");
  };

  const timezones = useTimezones();

  return (
    <>
      <PageWideSpinner />
      <div className="flex bg-zinc-200 w-dvw text-slate-800">
        <div className="flex bg-background w-[50dvw] h-dvh">
          <div className="m-auto text-4xl text-zinc-200">
            Welcome to <span className="font-bold text-5xl">Are You In</span>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full flex">
          <div className="flex h-dvh mx-auto">
            <div className="flex flex-col gap-3 my-auto w-[30dvw]">
              <Input
                type="text"
                label="Company Name"
                className="rounded outline-slate-800"
                {...register("companyName", {
                  required: "Company Name is Required",
                  minLength: 1,
                })}
              />

              <div className="grid grid-cols-2 gap-3 justify-around w-full">
                <span className="font-bold my-auto">Notify at: </span>
                <Input
                  type="time"
                  label="Push Notifications At"
                  className="rounded outline-slate-800"
                  defaultValue={"09:00"}
                  {...register("pushNotificationsAt", {
                    required: "Notify At Time is Required",
                    minLength: 5,
                    maxLength: 5,
                  })}
                />

                <span className="font-bold my-auto">Auto-deny at: </span>
                <Input
                  type="time"
                  label="Auto-deny At"
                  className="rounded outline-slate-800"
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
    </>
  );
}
