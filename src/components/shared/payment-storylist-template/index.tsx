import React, { ReactNode, useState } from "react";
import { Icon, chakra } from "@chakra-ui/react";

import { motion } from "framer-motion";
import NoData from "@/components/ui/no-data/NoData"; // Yo'lni tekshiring
import { listItemVariants } from "@/plugin/animation-framer/animateList"; // Yo'lni tekshiring
import { IoFolderOpenOutline } from "react-icons/io5";
import Image from "@/components/ui/image/Image";
import Subtext from "@/components/ui/typography/SubText";
import Text from "@/components/ui/typography/Text";
import { useTranslation } from "@/i18n/languageConfig";

const MotionFlex = chakra(motion.div);

export interface TypePayment {
  id: string;
  name: string;
  adrees: string;
  date: string;
  time: string;
  sum: string;
  image: string;
}

interface Props {
  devices: TypePayment[];
  selectItem: TypePayment | null;
  setSelectItem: (device: TypePayment) => void;
}

const PaymentStoryListTemplate = ({
  devices: projects,
  selectItem,
  setSelectItem,
}: Props) => {
  // ----------------------------  HOOKS
  const { t } = useTranslation("workspace.pages.payment.");

  // ----------------------------  STATES

  // ----------------------------  FUNCTIONS
  const projectsByDate = groupByDate(projects);
  console.log("Grouped Projects by Date:", projectsByDate);

  function groupByDate(data: TypePayment[]) {
    return data.reduce<Record<string, TypePayment[]>>((acc, item) => {
      if (!acc[item.date]) {
        acc[item.date] = [];
      }
      acc[item.date].push(item);
      return acc;
    }, {});
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="max-h-[300px]!    flex items-center justify-center">
        <NoData title={t("nodataTitle")} description={t("nodataDesc")} />
      </div>
    );
  }

  return (
    <div className="w-full  ">
      {Object.entries(projectsByDate)
        .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
        .map(([date, items]) => (
          <div key={date} className="">
            {/* DATE HEADER */}
            <div className="  pb-2.5! border-b! border-[var(--separator-base)]! mb-2.5! mt-10!">
              <Text fontSize={"1em"} color={"#828282"}>
                {date}
              </Text>
            </div>

            {/* ITEMS */}
            <div className="flex flex-col gap-4! ">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between   h-12.5!   "
                >
                  <div className="flex items-center justify-between w-full! gap-2.5! ">
                    <div className="border! border-(--bg-second)! p-1!  rounded-[5px]!   h-10! flex items-center justify-center w-10!">
                      <Image
                        src={item.image}
                        alt=""
                        className="rounded-full w-5! h-5! object-cover!"
                      />
                    </div>

                    <div className="  w-full h-full! flex justify-between items-center relative ">
                      <div>
                        <div className="truncate max-w-[170px]">
                          <Text lineHeight={"short"}> {item.name}</Text>
                        </div>
                        <div className=" truncate max-w-[180px]">
                          <Subtext>{item.adrees}</Subtext>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-green-400 text-sm font-semibold">
                          +{item.sum} UZS
                        </div>
                        <div className="text-xs text-gray-400">{item.time}</div>
                      </div>
                      <div className="absolute -bottom-2.5 left-0 right-0 w-full! h-[1px]! bg-[var(--separator-base)]" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
};

export default PaymentStoryListTemplate;
