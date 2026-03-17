import { FC } from "react";
import {
  Select as ChakraSelect,
  chakraComponents,
  GroupBase,
} from "chakra-react-select";
import { Box, Field, Icon } from "@chakra-ui/react";
import Checkbox from "../checkbox/Checkbox";
import Text from "../typography/Text";
import { LiaAngleDownSolid, LiaAngleUpSolid } from "react-icons/lia";
import InputRequiredIconTooltip from "../input/InputRequiredIconTooltip";
import { FaXmark } from "react-icons/fa6";

export interface OptionWithImage {
  value: number | string;
  label: string;
  image?: string;
  icon?: any;
}
interface Props {
  options: OptionWithImage[];
  value?: OptionWithImage[]; // oldingi string[] o‘rniga
  onChange?: (value: OptionWithImage[] | null) => void; // butun object qaytaradi
  placeholder?: string;
  label?: string;
  isRequired?: boolean;
  mode: "single" | "team";
}

const SelectAvatarCheck: FC<Props> = ({
  options,
  value,
  onChange,
  placeholder = "Выберите участников",
  mode,
  label,
  isRequired,
}) => {
  // string[] → OptionWithImage[]

  const handleChange = (
    newValue: OptionWithImage | OptionWithImage[] | null,
  ) => {
    if (!onChange) return;

    if (mode === "single") {
      onChange(newValue ? [newValue as OptionWithImage] : null);
    } else {
      onChange(newValue as OptionWithImage[] | null);
    }
  };

  const selectedOptions = options.filter((opt) =>
    value?.some((v) => v.value === opt.value),
  );

  return (
    <div>
      <Field.Root>
        {label && (
          <Field.Label
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
          </Field.Label>
        )}
        <ChakraSelect<OptionWithImage, true, GroupBase<OptionWithImage>>
          isMulti={mode !== "single"} // single bo‘lsa false
          closeMenuOnSelect={mode === "single"} // single selectda menu avtomatik yopilsin
          hideSelectedOptions={false}
          options={options}
          value={selectedOptions}
          onChange={handleChange}
          placeholder={placeholder}
          blurInputOnSelect={mode === "single"} // single da input blur bo‘lsin
          menuShouldCloseOnBlur={true} // input tashqariga bosilganda yopilsin
          openMenuOnFocus={true} // focus bo‘lganda ochilsin
          menuPosition="fixed"
          menuPlacement="top"
          zIndex="212112"
          styles={{
            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
          }}
          chakraStyles={{
            control: (provided, state) => {
              // Tanlangan elementlar bor yoki yo'qligini tekshiramiz
              const hasValue = state.hasValue || state.getValue().length > 0;

              return {
                ...provided,
                borderRadius: "30px",
                borderWidth: "1px",
                // Border rangi: Agar qiymat bo'lsa har doim qizil, bo'lmasa focusga qarab
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
            valueContainer: (provided, state) => ({
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
              border: "0px",
              shadow: "none",
              gap: "8px",
              maxHeight: "250px!",
            }),
            dropdownIndicator: (provided) => ({
              ...provided,
              color: "var(--text-main)",
            }),
            singleValue: (provided) => ({
              ...provided,
              color: "var(--text-def)!",
            }),

            option: (provided) => ({
              ...provided,
              borderRadius: "10px",
              borderWidth: "1px",
              borderColor: "var(--border-list)",
              backgroundColor: "var(--bg-main)",
            }),
          }}
          components={{
            // ❗ default chiplarni o‘chirib tashlaymiz
            MultiValue: () => null,
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
              const { selectProps } = props;
              return (
                <chakraComponents.DropdownIndicator {...props}>
                  {selectProps.menuIsOpen ? (
                    <LiaAngleUpSolid color="gray" />
                  ) : (
                    <LiaAngleDownSolid color="gray" />
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

                  {/* children doim render bo‘lsin, lekin single mode da input clear bo‘lmasligi kerak */}
                  {children}
                </chakraComponents.ValueContainer>
              );
            },

            // ✅ Option: checkbox + avatar + name
            Option: (props) => {
              const { data, isSelected } = props;

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
                    {data.icon && (
                      <Icon as={data.icon} fontSize={18} color="brand.400" />
                    )}

                    <div className="max-w-50!">
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

export default SelectAvatarCheck;
