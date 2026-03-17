import { FC } from "react";
import {
  CreatableSelect,
  chakraComponents,
  GroupBase,
} from "chakra-react-select";
import { Box, Field, Icon } from "@chakra-ui/react";
import Checkbox from "../checkbox/Checkbox";
import Text from "../typography/Text";
import { LiaAngleDownSolid, LiaAngleUpSolid } from "react-icons/lia";
import InputRequiredIconTooltip from "../input/InputRequiredIconTooltip";
import { FaXmark } from "react-icons/fa6";
import Button from "../buttons/Button";

export interface OptionWithImage {
  value: string;
  label: string;
  image?: string;
  icon?: any;
}

interface Props {
  options: OptionWithImage[];
  value?: OptionWithImage[];
  onChange?: (value: OptionWithImage[] | null) => void;
  onCreateOption?: (inputValue: string) => void;
  placeholder?: string;
  label?: string;
  isRequired?: boolean;
  mode: "single" | "team";
  createOptionMessage?: string;
}

const SelectCreatableAvatarCheck: FC<Props> = ({
  options,
  value,
  onChange,
  onCreateOption,
  placeholder = "Выберите участников",
  mode,
  label,
  isRequired,
  createOptionMessage = "У вас нет этого сотрудника, пригласите его",
}) => {
  const handleChange = (
    newValue: OptionWithImage | readonly OptionWithImage[] | null,
  ) => {
    if (!onChange) return;

    if (mode === "single") {
      onChange(newValue ? [newValue as OptionWithImage] : null);
    } else {
      onChange(newValue ? [...(newValue as readonly OptionWithImage[])] : null);
    }
  };

  const handleCreate = (inputValue: string) => {
    if (onCreateOption) {
      onCreateOption(inputValue);
    }
    console.log(inputValue + "dasddsasdasdad");
  };

  const selectedOptions = value
    ? options.filter((opt) => value.some((v) => v.value === opt.value))
    : [];

  return (
    <div>
      <Field.Root>
        {label && (
          <Field.Label
            className="mb-[5px]! flex items-center gap-1.5! ml-4!"
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
          </Field.Label>
        )}
        <CreatableSelect<OptionWithImage, boolean, GroupBase<OptionWithImage>>
          isMulti={mode !== "single"}
          closeMenuOnSelect={mode === "single"}
          hideSelectedOptions={false}
          options={options}
          value={selectedOptions}
          onChange={handleChange}
          onCreateOption={handleCreate}
          placeholder={placeholder}
          blurInputOnSelect={mode === "single"}
          openMenuOnFocus={true}
          menuPosition="fixed"
          menuPlacement="top"
          formatCreateLabel={(inputValue) => `${inputValue}`}
          styles={{
            menuPortal: (base) => ({
              ...base,
              zIndex: 9999,
            }),
          }}
          chakraStyles={{
            control: (provided, state) => {
              const hasValue = state.hasValue || state.getValue().length > 0;

              return {
                ...provided,
                borderRadius: "30px",
                borderWidth: "1px",
                borderColor: hasValue
                  ? "var(--main-color)"
                  : state.isFocused
                    ? "var(--main-color)"
                    : "var(--border-input)",

                _focus: {
                  shadow: "xs",
                },
              };
            },
            valueContainer: (provided) => ({
              ...provided,
            }),
            menu: (provided) => ({
              ...provided,
              backgroundColor: "var(--bg-main)",
              borderRadius: "30px",
              padding: "15px",
              boxShadow: "0px 4px 8px 2px #00000040",
            }),

            menuList: (provided) => ({
              ...provided,
              display: "flex",
              flexDirection: "column",
              shadow: "none",
              gap: "8px",
              maxHeight: "350px!",
            }),
            dropdownIndicator: () => ({}),

            option: (provided, state) => ({
              ...provided,
              borderRadius: "10px",
              borderWidth: "1px",
              borderColor: (state.data as any).__isNew__
                ? "transparent"
                : "var(--border-list)",
              backgroundColor: "var(--bg-main)",
            }),
          }}
          components={{
            MultiValue: () => null,
            MenuList: (props) => {
              // Children ni array ga aylantiramiz
              const childrenArray = Array.isArray(props.children)
                ? props.children
                : [props.children];

              // Create option va oddiy optionlarni ajratamiz
              const createOption = childrenArray.find(
                (child: any) => child?.props?.data?.__isNew__,
              );
              const regularOptions = childrenArray.filter(
                (child: any) => !child?.props?.data?.__isNew__,
              );
              console.log(regularOptions);

              return (
                <chakraComponents.MenuList {...props}>
                  {/* 1. Create option (agar mavjud bo'lsa) */}
                  {createOption}

                  {/* 2. Sarlavha "Сотрудники" (agar oddiy optionlar mavjud bo'lsa) */}
                  {regularOptions.length > 0 && (
                    <Box
                      paddingTop={createOption ? "5px" : "0"}
                      borderBottom="1px solid var(--border-list)"
                    >
                      <Text
                        fontSize="0.9em"
                        fontWeight="600"
                        color="var(--text-label)"
                      >
                        {regularOptions.length} имена
                      </Text>
                    </Box>
                  )}

                  {/* 3. Oddiy optionlar ro'yxati */}
                  {regularOptions}
                </chakraComponents.MenuList>
              );
            },
            ClearIndicator: (props) => {
              return (
                <chakraComponents.ClearIndicator {...props}>
                  <Icon
                    as={FaXmark}
                    borderColor="brand.500"
                    color="brand.500"
                    colorPalette="brand"
                    border={"brand.500"}
                    borderWidth={1}
                    borderRadius={"100%"}
                    boxSize={4}
                  />
                </chakraComponents.ClearIndicator>
              );
            },
            DropdownIndicator: (props) => {
              return (
                <chakraComponents.DropdownIndicator {...props}>
                  {props.selectProps.menuIsOpen ? (
                    <LiaAngleUpSolid />
                  ) : (
                    <LiaAngleDownSolid />
                  )}
                </chakraComponents.DropdownIndicator>
              );
            },

            ValueContainer: ({ children, ...props }) => {
              const selected = props.getValue() as OptionWithImage[];

              return (
                <chakraComponents.ValueContainer {...props}>
                  {selected.length > 0 && mode !== "single" && (
                    <>
                      <Box
                        display="flex"
                        alignItems="center"
                        flexShrink={0}
                        gap="1.5"
                        className="px-6! py-1! bg-[#DABFFF8C]! rounded-[20px]!"
                      >
                        {selected[0].image && (
                          <img
                            src={selected[0].image}
                            width={20}
                            height={20}
                            style={{ borderRadius: "50%" }}
                          />
                        )}
                        {selected[0].icon && (
                          <Icon
                            as={selected[0].icon}
                            fontSize={18}
                            color="brand.400"
                          />
                        )}
                        <Text fontSize="0.85em" color="#711CE9">
                          {selected[0].label}
                        </Text>
                      </Box>
                      {mode === "team" && selected.length > 1 && (
                        <Text fontSize="1em" color="#711CE9" pl="10px">
                          ещё {selected.length - 1}
                        </Text>
                      )}
                    </>
                  )}

                  {children}
                </chakraComponents.ValueContainer>
              );
            },

            Option: (props) => {
              const { data, isSelected } = props;

              // Agar bu "create" option bo'lsa
              if ((data as any).__isNew__) {
                return (
                  <chakraComponents.Option {...props}>
                    <Box
                      display="flex"
                      flexDirection="column"
                      gap="10px"
                      width="100%"
                      borderColor="brand.500"
                      borderWidth="1px"
                      borderRadius="10px"
                      padding=" 20px 25px"
                    >
                      <Text fontSize="0.85em" color="var(--text-secondary)">
                        {createOptionMessage}
                      </Text>
                      <Button
                        size="sm"
                        colorPalette="brand"
                        variant="solid"
                        width="100%"
                        onClick={() => handleCreate(data.label)}
                      >
                        Добавить "{data.label}"
                      </Button>
                    </Box>
                  </chakraComponents.Option>
                );
              }

              // Oddiy option
              return (
                <chakraComponents.Option {...props}>
                  <Box display="flex" alignItems="center" gap="10px">
                    <Checkbox checked={isSelected} pointerEvents="none" />

                    {data.image && (
                      <img
                        src={data.image}
                        className="w-6! h-6!"
                        style={{ borderRadius: "50%" }}
                      />
                    )}

                    <div className="max-w-25!">
                      <Text truncate>{data.label}</Text>
                    </div>
                  </Box>
                </chakraComponents.Option>
              );
            },
          }}
        />
      </Field.Root>
    </div>
  );
};

export default SelectCreatableAvatarCheck;
