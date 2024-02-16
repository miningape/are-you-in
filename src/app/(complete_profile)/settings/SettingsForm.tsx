"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { UserFromAuth, useAuthContext } from "../AuthProvider";
import { UpdateCompanyDto, updateCompany } from "@/app/setup/updateCompany";
import { revalidateClientPath } from "../revalidateClientPath";
import { GrLinkNext } from "react-icons/gr";

function pickPartial<V, T extends keyof V>(pick: T[], from: V) {
  return pick.reduce((acc, field) => {
    acc[field] = from[field];
    return acc;
  }, {} as Partial<V>);
}

class Nullable<T> {
  static from = <T,>(value: T | null) => new Nullable<T>(value);
  constructor(private value: T | null) {}

  filter = (discriminator: (a: T) => boolean): Nullable<T> =>
    Nullable.from(
      this.value !== null && discriminator(this.value) ? this.value : null
    );
  then = <V,>(functor: (a: T) => V): Nullable<V> =>
    Nullable.from(this.value !== null ? functor(this.value) : null);
  else = <V,>(value: V) =>
    this.value === null ? Nullable.from(value) : Nullable.from(this.value);
  get = () => this.value;
}

const dirtyFieldsToArray = <T,>(
  dirtyFields: Partial<Readonly<Record<keyof T, boolean>>>
) =>
  Object.entries(dirtyFields)
    .filter(([, active]) => active)
    .map(([field]) => field)
    .filter((field): field is keyof UpdateCompanyDto => true);

export function SettingsForm() {
  const auth = useAuthContext();
  const settings = auth.user.company.settings;

  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields },
  } = useForm<UpdateCompanyDto>();

  const onSubmit: SubmitHandler<UpdateCompanyDto> = async (data) => {
    await Nullable.from(dirtyFields)
      .then(dirtyFieldsToArray)
      .filter((picks) => picks.length > 0)
      .then((picks) => pickPartial(picks, data))
      .then((dto) => updateCompany(auth.user.company.id, dto))
      .get();

    revalidateClientPath("/settings");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex">
      <div className="flex flex-col mt-10 w-[50dvw] divide-y">
        <input
          className="rounded px-2 py-1 my-5 outline-slate-800 text-slate-800 "
          {...register("companyName", {
            required: "Company Name is Required",
            minLength: 1,
            value: auth.user.company.name || "",
          })}
          placeholder="Company Name"
        />

        <div className="flex justify-between py-5 w-full">
          <span className=" pr-2 py-1">Notify at: </span>
          <input
            type="time"
            className="rounded px-2 py-1 outline-slate-800 text-slate-800"
            defaultValue={"09:00"}
            {...register("pushNotificationsAt", {
              required: "Notify At Time is Required",
              minLength: 5,
              maxLength: 5,
              value: settings.push_notifications_at,
            })}
          />
        </div>

        <div className="flex justify-between py-5 w-full">
          <span className=" pr-2 py-1">Auto-deny at: </span>
          <input
            type="time"
            className="rounded px-2 py-1 outline-slate-800 text-slate-800"
            {...register("autoDenyAt", {
              required: "Auto-deny At Time is Required",
              minLength: 5,
              maxLength: 5,
              value: settings.auto_deny_at,
            })}
          />
        </div>

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
