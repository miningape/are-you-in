"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/db";
import { redirect } from "next/navigation";

export interface UpdateCompanyDto {
  companyName: string;
  pushNotificationsAt: string;
  autoDenyAt: string;
  timezone: string;
}

export async function updateCompany(
  companyId: string,
  updateCompanyDto: Partial<UpdateCompanyDto>
) {
  await prisma.company.update({
    where: {
      id: companyId,
    },
    data: {
      name: updateCompanyDto.companyName,
      settings: {
        update: {
          auto_deny_at: updateCompanyDto.autoDenyAt,
          push_notifications_at: updateCompanyDto.pushNotificationsAt,
          timezone: updateCompanyDto.timezone,
        },
      },
    },
  });
}
