"use client";

import { Input } from "@nextui-org/react";
import { useAuthContext } from "@/app/(complete_profile)/AuthProvider";
import { useForm } from "react-hook-form";
import { updateUser } from "./updateUser";
import { revalidateClientPath } from "../../revalidateClientPath";
import { pickDirtyFields } from "@/util/pickDirtyFields";
import { hasDifferentValuesFrom } from "@/util/differentValuesFrom";
import { useServiceWorker } from "@/app/RegisterPwa";
import { PushNotificationSwitch } from "@/components/PushNotificationSwitch";

interface UserUpdateForm {
  name: string | undefined;
  role: string | undefined;
}

export function UserClient() {
  const auth = useAuthContext();
  const {
    handleSubmit,
    register,
    formState: { dirtyFields, errors },
  } = useForm<UserUpdateForm>();

  const onSubmit = handleSubmit(async (form) => {
    await pickDirtyFields(dirtyFields, form)
      .filter(
        hasDifferentValuesFrom({
          name: auth.user.name ?? undefined,
          role: auth.user.flavour ?? undefined,
        })
      )
      .then((changedValues) => ({
        name: changedValues.name,
        flavour: changedValues.role,
      }))
      .then((dto) => updateUser(auth.user.id, dto))
      .get();

    await revalidateClientPath(`/settings/${auth.user.id}`);
  });

  return (
    <form onSubmit={onSubmit} className="w-1/2 mx-auto">
      <div className="flex flex-col gap-4">
        <Input
          isDisabled
          type="email"
          label="Email"
          defaultValue={auth.email}
        />
        <Input
          type="text"
          label="Name"
          defaultValue={auth.user.name ?? undefined}
          {...register("name", {
            setValueAs: (value) => (value === "" ? null : value),
          })}
        />
        <Input
          type="text"
          label="Role"
          defaultValue={auth.user.flavour ?? undefined}
          {...register("role", {})}
        />

        <PushNotificationSwitch />

        <div className="w-full pt-4">
          <button type="submit" className="float-right">
            Save
          </button>
        </div>

        {(errors.name || errors.role) && (
          <p className="text-red-500 absolute bottom-4 right-4">
            {errors.role?.message || ""}
            {errors.name?.message || ""}
          </p>
        )}
      </div>
    </form>
  );
}
