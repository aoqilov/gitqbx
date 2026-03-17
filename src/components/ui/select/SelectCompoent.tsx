"use client";

import {
  Avatar,
  Badge,
  Box,
  HStack,
  Icon,
  Input,
  Portal,
  Select,
  createListCollection,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { LuX, LuChevronDown, LuChevronUp, LuSearch } from "react-icons/lu";
import Checkbox from "../checkbox/Checkbox";
import Text from "../typography/Text";
import InputRequiredIconTooltip from "../input/InputRequiredIconTooltip";
import { IconType } from "react-icons";
import { TbCheckbox } from "react-icons/tb";

type SelectValue = string | number;

export type SelectItem = {
  label: string;
  value: SelectValue;
  avatar?: string;
  icon?: IconType;
  taskCount?: number;
  taskPercent?: number;
  disabled?: boolean;
};

interface BaseProps {
  isSearchable?: boolean;
  items: SelectItem[];
  placeholder?: string;
  isClearable?: boolean;
  label?: string;
  isRequired?: boolean;
  disabled?: boolean;
  error?: string;
  haveTask?: boolean;
}

// isMulti=true  → value: SelectValue[],  onValueChange: (values: SelectValue[]) => void
interface MultiProps extends BaseProps {
  isMulti: true;
  value?: SelectValue[];
  onValueChange?: (values: SelectValue[]) => void;
}

// isMulti=false | undefined  → value: SelectValue,  onValueChange: (value: SelectValue) => void
interface SingleProps extends BaseProps {
  isMulti?: false;
  value?: SelectValue;
  onValueChange?: (value: SelectValue) => void;
}

type MultiSelectProps = MultiProps | SingleProps;

export const SelectCompoent = ({
  isSearchable = false,
  placeholder = "Выберите...",
  label,
  isMulti = false,
  isRequired = false,
  disabled = false,
  items,
  value,
  onValueChange,
  error,
  isClearable = true,
  haveTask = false,
}: MultiSelectProps) => {
  const MAX_VISIBLE_BADGES = 1;
  const renderSelectedBadge = (item: SelectItem) => {
    if (item.avatar && isMulti) {
      return (
        <Badge
          key={String(item.value)}
          bg="red.500"
          color="purple.700"
          borderRadius="full"
          pl="1"
          pr="2"
          fontSize="xs"
          maxW="180px"
        >
          <HStack gap="1" minW={0}>
            <Avatar.Root size="2xs" flexShrink={0}>
              <Avatar.Image src={item.avatar} />
              <Avatar.Fallback>{item.label?.[0] ?? "?"}</Avatar.Fallback>
            </Avatar.Root>
            <Text as="span" truncate>
              {item.label}
            </Text>
          </HStack>
        </Badge>
      );
    }

    if (item.icon) {
      return (
        <Badge
          key={String(item.value)}
          bg="purple.500/20"
          color="purple.700"
          borderRadius="full"
          pl="1"
          pr="2"
          fontSize="xs"
          maxW="180px"
        >
          <HStack gap="1" minW={0}>
            <Icon as={item.icon} boxSize={4} flexShrink={0} />
            <Text as="span" truncate>
              {item.label}
            </Text>
          </HStack>
        </Badge>
      );
    }
    return (
      <Text
        key={String(item.value)}
        borderRadius="full"
        px="2"
        fontSize="1em"
        maxW="300px"
        truncate
      >
        {item.label}
      </Text>
    );
  };

  // value ni har doim SelectValue[] ko'rinishiga keltiramiz — ichki logika uchun
  const normalizedValue: SelectValue[] = isMulti
    ? ((value as SelectValue[] | undefined) ?? [])
    : value !== undefined && value !== null && value !== ""
      ? [value as SelectValue]
      : [];

  // 1) Internal search state — tashqaridan prop kerak emas
  const [search, setSearch] = useState("");

  // Filter items by search
  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => item.label.toLowerCase().includes(q));
  }, [items, search]);

  const collection = useMemo(
    () => createListCollection({ items: filteredItems }),
    [filteredItems],
  );

  const selectedItems = useMemo(
    () =>
      items.filter((item) =>
        normalizedValue.some((v) => String(v) === String(item.value)),
      ),
    [items, normalizedValue],
  );

  const visibleItems = selectedItems.slice(0, MAX_VISIBLE_BADGES);
  const hiddenCount = Math.max(selectedItems.length - MAX_VISIBLE_BADGES, 0);

  // 2) Clear — isClearable=true bo'lsa va biror narsa tanlangan bo'lsa ko'rinadi
  const showClear = isClearable && normalizedValue.length > 0;

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isMulti) {
      (onValueChange as ((v: SelectValue[]) => void) | undefined)?.([]);
    } else {
      (onValueChange as ((v: SelectValue) => void) | undefined)?.("");
    }
  };

  return (
    <>
      <Select.Root
        collection={collection}
        multiple={isMulti}
        size="sm"
        width="full"
        disabled={disabled}
        value={normalizedValue.map(String)}
        onValueChange={(details) => {
          const mapped = details.value.map((v) => {
            const original = items.find((item) => String(item.value) === v);
            return original ? original.value : v;
          });
          if (isMulti) {
            (onValueChange as ((v: SelectValue[]) => void) | undefined)?.(
              mapped,
            );
          } else {
            (onValueChange as ((v: SelectValue) => void) | undefined)?.(
              mapped[0] ?? "",
            );
          }
        }}
        // Dropdown yopilganda searchni tozala
        onOpenChange={({ open }) => {
          if (!open) setSearch("");
        }}
      >
        <Select.HiddenSelect />

        {label && (
          <Select.Label
            className="mb-1.25! flex items-center gap-1.5! ml-4!"
            fontSize={"0.85em"}
            lineHeight={"100%!"}
            color={"var(--text-label)"}
          >
            {label}
            {isRequired && (
              <div>
                <InputRequiredIconTooltip />
              </div>
            )}
          </Select.Label>
        )}

        <Select.Control>
          <Select.Trigger
            height={"40px!"}
            borderRadius="3xl"
            borderColor={
              selectedItems.length > 0 ? "brand.500" : "var(--border-input)"
            }
            _open={{ borderColor: "brand.500" }}
            _focusVisible={{
              borderColor: "brand.500",
              boxShadow: "0 0 0 1px var(--chakra-colors-purple-500)",
            }}
          >
            {selectedItems.length === 0 ? (
              <Select.ValueText
                placeholder={placeholder}
                fontSize={"0.85em"}
                px={2}
              />
            ) : (
              <HStack flexWrap="nowrap" gap="1" overflow="hidden">
                {visibleItems.map(renderSelectedBadge)}
                {hiddenCount > 0 && (
                  <Badge
                    flexShrink={0}
                    borderRadius="full"
                    px="2"
                    fontSize="xs"
                    colorPalette="gray"
                  >
                    +{hiddenCount} ещё
                  </Badge>
                )}
              </HStack>
            )}
          </Select.Trigger>

          <Select.IndicatorGroup>
            {/* 2) Clear button */}
            {showClear && (
              <Select.ClearTrigger onClick={handleClear}>
                <div className="border! border-(--main-color)! rounded-full! p-0.5! flex items-center justify-center">
                  <Icon as={LuX} boxSize={3} color={"brand.500"} />
                </div>
              </Select.ClearTrigger>
            )}

            {/* 3) Custom open/close icon — ichida ko'rsatilgan, prop emas */}
            <Select.Context>
              {(select) => (
                <Select.Indicator>
                  <Icon
                    as={select.open ? LuChevronUp : LuChevronDown}
                    boxSize={6}
                    color={select.open ? "brand.500" : "gray.400"}
                    transition="color 0.15s"
                  />
                </Select.Indicator>
              )}
            </Select.Context>
          </Select.IndicatorGroup>
        </Select.Control>

        <Portal>
          <Select.Positioner>
            <Select.Content
              boxShadow={"0px 4px 6px rgba(0, 0, 0, 0.2)"}
              borderWidth="1px"
              borderColor="var(--border-list)"
              borderRadius="xl"
              p="2"
            >
              {/* 1) Search input — har doim ko'rinadi */}
              {isSearchable && (
                <HStack px="1" pb="2" pt="1">
                  <Icon
                    as={LuSearch}
                    boxSize={3.5}
                    color={search ? "brand.500" : "gray.300"}
                    flexShrink={0}
                  />
                  <Input
                    size="xs"
                    variant={"flushed"}
                    placeholder="Поиск..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.stopPropagation()}
                    border="none"
                    boxShadow="none"
                    _focus={{
                      border: "none",
                      boxShadow: "none",
                    }}
                    _focusVisible={{ border: "none", boxShadow: "none" }}
                    _hover={{ border: "none" }}
                    _active={{ border: "none" }}
                  />
                  <div
                    onClick={() => setSearch("")}
                    style={{ cursor: "pointer" }}
                  >
                    {search && <Icon as={LuX} boxSize={3.5} color="gray.600" />}
                  </div>
                </HStack>
              )}

              {filteredItems.length === 0 && (
                <div>
                  <Text
                    fontSize="xs"
                    color="gray.400"
                    textAlign="center"
                    py="3"
                  >
                    Ничего не найдено
                  </Text>
                </div>
              )}

              {filteredItems.map((item) => {
                const isSelected = selectedItems.some(
                  (selected) => String(selected.value) === String(item.value),
                );

                return (
                  <Select.Item
                    item={item}
                    key={String(item.value)}
                    borderWidth="1px"
                    borderColor="var(--border-list)"
                    borderRadius="2xl"
                    mb="5px"
                    aria-disabled={item.disabled ?? false}
                    opacity={item.disabled ? 0.4 : 1}
                    cursor={item.disabled ? "not-allowed" : "pointer"}
                    _selected={{
                      bg: !isMulti ? "brand.500" : "transparent",
                    }}
                  >
                    <Box
                      height={isMulti ? "40px!" : "32px!"}
                      className="flex items-center  w-full justify-between"
                    >
                      <div className="flex items-center gap-1">
                        {isMulti && <Checkbox checked={isSelected} />}

                        {item.avatar && (
                          <Avatar.Root size="xs" flexShrink={0}>
                            <Avatar.Image src={item.avatar} />
                            <Avatar.Fallback>
                              {item.label?.[0] ?? "?"}
                            </Avatar.Fallback>
                          </Avatar.Root>
                        )}

                        {item.icon && !item.avatar && (
                          <Icon
                            as={item.icon}
                            boxSize={4}
                            flexShrink={0}
                            color={
                              isSelected && !isMulti ? "white" : "brand.500"
                            }
                          />
                        )}
                        {!isMulti ? (
                          <Box w={"full"} borderRadius="full">
                            <Text
                              color={isSelected ? "white" : "var(--text-def)"}
                              borderRadius="full"
                              px="1"
                              maxW="220px"
                              truncate
                            >
                              {item.label}
                            </Text>
                          </Box>
                        ) : (
                          <Badge
                            borderRadius="full"
                            px="2"
                            mx="1"
                            maxW="220px"
                            bg={isSelected ? "purple.500/20" : "transparent"}
                            truncate
                          >
                            <Text>{item.label}</Text>
                          </Badge>
                        )}
                      </div>
                      <div>
                        {haveTask && (
                          <div className="flex items-center gap-1">
                            <div className="flex items-center gap-1 border-r! pr-2!">
                              {item.taskCount}{" "}
                              <Icon as={TbCheckbox} color={"brand.500"} />
                            </div>
                            <div>
                              {item.taskPercent}{" "}
                              <span className="text-(--main-color)!">
                                %
                              </span>{" "}
                            </div>
                          </div>
                        )}
                      </div>
                    </Box>
                  </Select.Item>
                );
              })}
            </Select.Content>
          </Select.Positioner>
        </Portal>
      </Select.Root>

      {error && (
        <Text mt="1" fontSize="xs" color="red.500">
          {error}
        </Text>
      )}
    </>
  );
};

// HOW TO USE:

// <div className=" flex flex-col gap-5! ">
//             <Controller
//               name="membersId"
//               control={control}
//               rules={{ required: "Выберите участников для роли" }}
//               render={({ field }) => (
//                 <SelectAvatarCheckNew
//                   haveTask
//                   isSearchable
//                   isRequired
//                   label="Members"
//                   items={mockMembers.map((member) => ({
//                     label: member.label,
//                     value: member.value,
//                     avatar: member.avatar,
//                     taskCount: 12,
//                     taskPercent: 76,
//                   }))}
//                   isMulti
//                   value={field.value}
//                   onValueChange={field.onChange}
//                 />
//               )}
//             />
//             <Controller
//               name="teamsId"
//               control={control}
//               render={({ field }) => (
//                 <SelectAvatarCheckNew
//                   label="teams"
//                   items={mockTeams}
//                   value={field.value}
//                   onValueChange={field.onChange}
//                 />
//               )}
//             />
//             <Controller
//               name="teamsId"
//               control={control}
//               render={({ field }) => (
//                 <SelectAvatarCheckNew
//                   label="single basic"
//                   items={mockTeams.map((team) => ({
//                     label: team.label,
//                     value: team.value,
//                   }))}
//                   value={field.value}
//                   onValueChange={field.onChange}
//                 />
//               )}
//             />
//           </div>
