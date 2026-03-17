import { FC } from "react";
import {
  chakraComponents,
  Select as ChakraSelect,
  GroupBase,
  Props,
} from "chakra-react-select";
import { useColorMode } from "../provider/color-mode";
import { Field, Icon, Separator, Text } from "@chakra-ui/react";
import { MdClear } from "react-icons/md";
import { FaCalendarAlt } from "react-icons/fa";
import Tag from "../tag/Tag";
import InputRequiredIconTooltip from "../input/InputRequiredIconTooltip";

export interface OptionWithImage {
  value: string;
  label: string;
  image?: string;
  icon?: any;
  isDisabled?: boolean;
}

interface SelectWithImagePropsI extends Omit<
  Props<OptionWithImage, false, GroupBase<OptionWithImage>>,
  "options" | "value" | "onChange"
> {
  showSelected?: boolean;
  hideList?: boolean;
  error?: string;
  deleteItemsMethod?: (mode: "single" | "all", value: string) => void;
  label?: string;
  isRequired?: boolean;
  options: OptionWithImage[];
  //   value?: string | OptionWithImage | OptionWithImage[];
  //   onChange?: (value: string | OptionWithImage | OptionWithImage[] | null) => void;
  onChange?: (value: string | string[] | null) => void;
  value?: string | string[] | OptionWithImage | OptionWithImage[];
}

const SelectWithImageAndIcon: FC<SelectWithImagePropsI> = ({
  showSelected,
  hideList = false,
  error,
  label,
  isRequired,
  deleteItemsMethod,
  options,
  value: propValue,
  onChange: propOnChange,
  ...props
}) => {
  const theme = useColorMode();

  // Convert string value to OptionWithImage
  //   const getOptionFromValue = (
  //     val: string | OptionWithImage | OptionWithImage[] | undefined,
  //   ): OptionWithImage | OptionWithImage[] | null => {
  //     if (!val) return null;

  //     if (typeof val === "string") {
  //       const found = options.find((opt) => opt.value === val);
  //       return found || null;
  //     }

  //     if (Array.isArray(val)) {
  //       return val
  //         .map((v) =>
  //           typeof v === "string"
  //             ? options.find((opt) => opt.value === v) || v
  //             : v,
  //         )
  //         .filter(Boolean) as OptionWithImage[];
  //     }

  //     return val;
  //   };
  const getOptionFromValue = (
    val: string | string[] | OptionWithImage | OptionWithImage[] | undefined,
  ): OptionWithImage | OptionWithImage[] | null => {
    if (!val) return null;

    // string → Option
    if (typeof val === "string") {
      return options.find((opt) => opt.value === val) ?? null;
    }

    // string[] | OptionWithImage[]
    if (Array.isArray(val)) {
      return val
        .map((v) =>
          typeof v === "string" ? options.find((opt) => opt.value === v) : v,
        )
        .filter(Boolean) as OptionWithImage[];
    }

    // OptionWithImage
    return val;
  };

  const value = getOptionFromValue(propValue);

  // Handle onChange to return string value for react-hook-form
  const handleChange = (
    newValue: OptionWithImage | OptionWithImage[] | null,
  ) => {
    if (propOnChange) {
      if (!newValue) {
        propOnChange(null);
      } else if (Array.isArray(newValue)) {
        propOnChange(newValue?.map((v) => v.value));
      } else {
        propOnChange(newValue.value);
      }
    }
  };

  // Custom format for option label with image
  const formatOptionLabel = (option: OptionWithImage) => (
    <div className="flex items-center gap-2">
      {option.image && (
        <img
          src={option.image}
          alt={option.label}
          className="w-5 h-5 rounded-full object-cover"
        />
      )}
      {option.icon && <Icon as={option.icon} fontSize="16px" />}
      <span>{option.label}</span>
    </div>
  );

  return (
    <>
      <Field.Root invalid={!!error}>
        {label && (
          <Field.Label
            className="mb-1.25!"
            fontSize={"0.85em"}
            lineHeight={"100%!"}
            color={"var(--text-label)"}
          >
            {label}
            {isRequired && <InputRequiredIconTooltip />}
          </Field.Label>
        )}
        <ChakraSelect
          {...props}
          options={options}
          value={value}
          onChange={handleChange}
          formatOptionLabel={formatOptionLabel}
          chakraStyles={{
            control: (provided, state) => ({
              ...provided,
              borderRadius: "30px",
              borderColor: error ? "red.500" : "var(--border-input)",
              borderWidth: "1px",
            }),
            option: (provided, state) => ({
              ...provided,
              borderRadius: "5px",
              color:
                theme.colorMode == "dark" || state.isSelected ? "#fff" : "#000",
              bg:
                theme.colorMode == "light" &&
                state.isFocused &&
                !state.isSelected
                  ? "blackAlpha.50"
                  : theme.colorMode == "dark" &&
                      state.isFocused &&
                      !state.isSelected
                    ? "whiteAlpha.50"
                    : state.isSelected
                      ? "brand.500"
                      : "",
              fontSize: "0.9em",
            }),
            valueContainer: (provided, state) => ({
              ...provided,
              color: theme.colorMode == "dark" ? "#fff" : "#000",
            }),
            singleValue: (provided, state) => ({
              ...provided,
              color: theme.colorMode == "dark" ? "#fff" : "#000",
              fontSize: "0.9em",
            }),
            multiValue: (provided, state) => ({
              ...provided,
              display: "flex",
              flexDirection: "row",
            }),
            multiValueLabel: (provided, state) => ({
              ...provided,
              display: "flex",
              flexDirection: "row",
              fontSize: "0.9em",
            }),
            placeholder: (provided, state) => ({
              ...provided,
              width: "300px",
              fontSize: "0.9em",
              display: "flex",
              alignItems: "center",
            }),
          }}
          focusRingColor="brand.500"
          selectedOptionColorPalette="brand"
          selectedOptionStyle="color"
          components={{
            ValueContainer: ({ children, ...props }) => {
              return (
                <chakraComponents.ValueContainer {...props}>
                  <div style={{ width: "fit-content", overflow: "auto" }}>
                    <div className="flex w-fit overflow-hidden scroll-select-container">
                      {children}
                    </div>
                  </div>
                </chakraComponents.ValueContainer>
              );
            },

            SingleValue: ({ children, ...props }) => {
              const option = props.data as OptionWithImage;
              return (
                <chakraComponents.SingleValue {...props}>
                  <div className="flex items-center gap-2">
                    {option.image && (
                      <img
                        src={option.image}
                        alt={option.label}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                    )}
                    {option.icon && <Icon as={option.icon} fontSize="16px" />}
                    <span>{option.label}</span>
                  </div>
                </chakraComponents.SingleValue>
              );
            },

            MultiValueContainer: ({ children, ...props }) => {
              const { data } = props as { data: OptionWithImage };
              return (
                <Tag {...props} colorPalette="purple">
                  <div className="flex gap-[5px] items-center">
                    {data.image && (
                      <img
                        src={data.image}
                        alt={data.label}
                        className="w-4 h-4 rounded-full object-cover"
                      />
                    )}
                    {data.icon && <Icon as={data.icon} fontSize="14px" />}
                    {data.label}
                    <Icon
                      as={MdClear}
                      className="hover:cursor-pointer"
                      fontSize="1em"
                      onClick={() =>
                        deleteItemsMethod
                          ? deleteItemsMethod("single", data.value)
                          : console.log(222)
                      }
                    />
                  </div>
                </Tag>
              );
            },

            MenuList: ({ children, ...props }) => {
              return (
                <chakraComponents.MenuList {...props}>
                  <div className="flex flex-col gap-2.5">
                    {showSelected && (
                      <>
                        <div className="flex flex-col gap-1">
                          {Array.isArray(value) ? (
                            <>
                              {!!!value.length ? (
                                <div
                                  style={{
                                    padding: "15px",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "2px",
                                  }}
                                >
                                  <Icon
                                    fontSize="0.8em"
                                    color="var(--subtext-color)"
                                    as={FaCalendarAlt}
                                  />
                                  <Text
                                    fontSize="0.8em"
                                    color="var(--subtext-color)"
                                  >
                                    Список пуст
                                  </Text>
                                </div>
                              ) : (
                                <div
                                  style={{
                                    padding: "5px 7px",
                                    color: "var(--grey-color)",
                                    border: "1px solid var(--grey-color)",
                                    borderRadius: "30px",
                                    fontSize: "0.9em",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    gap: "5px",
                                  }}
                                  onClick={() =>
                                    deleteItemsMethod
                                      ? deleteItemsMethod("all", "")
                                      : ""
                                  }
                                >
                                  <Text fontSize="0.9em">Очистить</Text>
                                  <Icon as={MdClear} marginTop="2px" />
                                </div>
                              )}

                              {value.map((el: OptionWithImage) => (
                                <div
                                  key={el.value}
                                  style={{
                                    padding: "5px 7px",
                                    color: "#fff",
                                    background: "var(--main-color)",
                                    borderRadius: "5px",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                  }}
                                >
                                  <div className="flex items-center gap-2">
                                    {el.image && (
                                      <img
                                        src={el.image}
                                        alt={el.label}
                                        className="w-4 h-4 rounded-full object-cover"
                                      />
                                    )}
                                    {el.icon && (
                                      <Icon as={el.icon} fontSize="14px" />
                                    )}
                                    <Text fontSize="0.9em">{el.label}</Text>
                                  </div>
                                  <Icon
                                    as={MdClear}
                                    onClick={() =>
                                      deleteItemsMethod
                                        ? deleteItemsMethod("single", el.value)
                                        : ""
                                    }
                                  />
                                </div>
                              ))}
                            </>
                          ) : value ? (
                            <div
                              style={{
                                padding: "5px 7px",
                                color: "#fff",
                                background: "var(--main-color)",
                                borderRadius: "5px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <div className="flex items-center gap-2">
                                {(value as OptionWithImage).image && (
                                  <img
                                    src={(value as OptionWithImage).image}
                                    alt={(value as OptionWithImage).label}
                                    className="w-4 h-4 rounded-full object-cover"
                                  />
                                )}
                                {(value as OptionWithImage).icon && (
                                  <Icon
                                    as={(value as OptionWithImage).icon}
                                    fontSize="14px"
                                  />
                                )}
                                <Text fontSize="0.9em">
                                  {(value as OptionWithImage).label}
                                </Text>
                              </div>
                              <Icon as={MdClear} />
                            </div>
                          ) : null}
                        </div>

                        {!hideList && <Separator />}
                      </>
                    )}

                    {!hideList && <>{children}</>}
                  </div>
                </chakraComponents.MenuList>
              );
            },
          }}
        />
        {error && (
          <Field.ErrorText fontSize="xs" color="error.500">
            {error}
          </Field.ErrorText>
        )}
      </Field.Root>
    </>
  );
};

export default SelectWithImageAndIcon;
