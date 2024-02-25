"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useAuthContext } from "../AuthProvider";
import { UpdateCompanyDto, updateCompany } from "@/app/setup/updateCompany";
import { revalidateClientPath } from "../revalidateClientPath";
import { Dropdown, Input, Select, SelectItem } from "@nextui-org/react";
import { pickDirtyFields } from "@/util/pickDirtyFields";
import { hasDifferentValuesFrom } from "@/util/differentValuesFrom";
import { useMemo } from "react";
import { useTimezones } from "@/hooks/useTimezones";

export function SettingsForm() {
  const auth = useAuthContext();
  const settings = auth.user.company.settings;

  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields },
  } = useForm<UpdateCompanyDto>();

  const onSubmit: SubmitHandler<UpdateCompanyDto> = async (data) => {
    await pickDirtyFields(dirtyFields, data)
      .filter(
        hasDifferentValuesFrom({
          companyName: auth.user.company.name ?? undefined,
          pushNotificationsAt: settings.push_notifications_at,
          autoDenyAt: settings.auto_deny_at,
        })
      )
      .then((dto) => updateCompany(auth.user.company.id, dto))
      .get();

    await revalidateClientPath("/settings");
  };

  const timezones = useTimezones();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-1/2 mx-auto">
      <div className="flex flex-col gap-4">
        <Input
          label="Company Name"
          defaultValue={auth.user.company.name || undefined}
          {...register("companyName", {
            required: "Company Name is Required",
            minLength: 1,
          })}
        />

        <Input
          label="Notify At"
          type="time"
          defaultValue={settings.push_notifications_at}
          {...register("pushNotificationsAt", {
            required: "Notify At Time is Required",
            minLength: 5,
            maxLength: 5,
          })}
        />

        <Input
          label="Auto-deny At"
          type="time"
          defaultValue={settings.auto_deny_at}
          {...register("autoDenyAt", {
            required: "Auto-deny At Time is Required",
            minLength: 5,
            maxLength: 5,
          })}
        />

        <Select
          label="Timezone"
          defaultSelectedKeys={[settings.timezone]}
          {...register("timezone", { required: "Timezone is required" })}
        >
          {timezones.map((timezone) => (
            <SelectItem key={timezone}>{timezone}</SelectItem>
          ))}
        </Select>

        <div className="w-full pt-4">
          <button type="submit" className="float-right">
            Save
          </button>
        </div>

        {(errors.companyName ||
          errors.autoDenyAt ||
          errors.pushNotificationsAt) && (
          <p className="text-red-500 absolute bottom-4 right-4">
            {errors.companyName?.message || ""}
            {errors.autoDenyAt?.message || ""}
            {errors.pushNotificationsAt?.message || ""}
          </p>
        )}
      </div>
    </form>
  );
}
