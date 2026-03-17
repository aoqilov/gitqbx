import React, { useState } from "react";
import { Text, HStack, Icon, Box, VStack, chakra } from "@chakra-ui/react";
import {
  HiOutlineDeviceMobile,
  HiOutlineDesktopComputer,
} from "react-icons/hi";
import { motion } from "framer-motion";
import NoData from "@/components/ui/no-data/NoData"; // Yo'lni tekshiring
import { listItemVariants } from "@/plugin/animation-framer/animateList"; // Yo'lni tekshiring

const MotionFlex = chakra(motion.div);

// Interfeys ta'rifi
export interface TypeDevice {
  id: string;
  name: string;
  type: "mobile" | "pc";
  lastLogin: string;
  subText: string;
}

interface Props {
  devices: TypeDevice[];
  selectItem: TypeDevice | null;
  setSelectItem: (device: TypeDevice) => void;
}

const DeviceListTemplate = ({ devices, selectItem, setSelectItem }: Props) => {
  if (!devices || devices.length === 0) {
    return (
      <div className="max-h-[300px]!    flex items-center justify-center">
        <NoData
          title="Нет синхронизированных устройств"
          description="В данный момент у вас нет подключённых или синхронизированных устройств."
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 py-2">
      {devices.map((device, index) => {
        const isActive = device.id === selectItem?.id;

        return (
          <MotionFlex
            key={device.id}
            custom={index}
            variants={listItemVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={() => setSelectItem(device)}
            cursor="pointer"
            // Dizayn xususiyatlari
            className="flex items-center justify-between relative h-12! px-4! rounded-[15px]!"
            border="1.5px"
            borderStyle="solid"
            borderColor={isActive ? "transparent" : "var(--border-list)"}
            bg={isActive ? "var(--main-color)" : "transparent"}
            color={isActive ? "white" : "var(--main-color)"}
            whileTap={{ scale: 0.98 }}
          >
            {/* Chap tomon: Icon va Matnlar */}
            <div className="flex items-center gap-1.5">
              <Icon
                as={
                  device.type === "mobile"
                    ? HiOutlineDeviceMobile
                    : HiOutlineDesktopComputer
                }
                fontSize={24}
                color={isActive ? "white" : "var(--main-color)"}
              />
              <div className="flex flex-col justify-center">
                <Text
                  fontWeight="500"
                  fontSize="1em"
                  color={isActive ? "#fff" : "var(--text-lgray-dgreydark)"}
                >
                  {device.name}
                </Text>
                <Text
                  fontSize="0.85em"
                  opacity={0.7}
                  color={isActive ? "white" : "var(--text-lgray-dgreydark)"}
                >
                  {device.subText}
                </Text>
              </div>
            </div>

            {/* O'ng tomon: Sana/Vaqt */}
            <Text
              fontSize="12px"
              whiteSpace="nowrap"
              alignSelf="flex-end"
              pb="8px"
              opacity={0.8}
              color={isActive ? "white" : "gray.400"}
            >
              {device.lastLogin}
            </Text>
          </MotionFlex>
        );
      })}
    </div>
  );
};

export default DeviceListTemplate;
