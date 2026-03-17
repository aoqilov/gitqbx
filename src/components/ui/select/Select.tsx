import { FC } from "react";
import {
  chakraComponents,
  Select as ChakraSelect,
  ChakraStylesConfig,
  GroupBase,
  Props,
  SelectComponentsConfig,
} from "chakra-react-select";
import { useColorMode } from "../provider/color-mode";
import {
  EmptyState,
  Field,
  Icon,
  Separator,
  Text,
  VStack,
} from "@chakra-ui/react";
import { MdClear } from "react-icons/md";
import { FaCalendarAlt } from "react-icons/fa";
import Tag from "../tag/Tag";
import InputRequiredIconTooltip from "../input/InputRequiredIconTooltip";

interface SelectPropsI extends Props<any, false, GroupBase<any>> {
  showSelected?: boolean;
  hideList?: boolean;
  error?: string;
  deleteItemsMethod?: (mode: "single" | "all", value: string) => void;
  label?: string;
  isRequired?: boolean;
}

// const chakraStyles: ChakraStylesConfig = {
// control: (styles) => ({ ...styles, padding: '2px', marginLeft: '6px' }),
// dropdownIndicator: (styles) => ({ ...styles, margin: '0px', padding: '0px' }),
// downChevron: (styles) => ({ ...styles, margin: '0px', padding: '0px' }),
// inputContainer: (styles) => ({ ...styles, borderRadius: '30px' }),
// input: (styles) => ({ ...styles, borderRadius: '30px' }),
// container: (styles) => ({ ...styles, borderRadius: '30px' }),
// valueContainer: (styles) => ({ ...styles, borderRadius: '30px' }),
// };

const Select: FC<SelectPropsI> = ({
  showSelected,
  hideList = false,
  error,
  label,
  isRequired,
  deleteItemsMethod,
  ...props
}) => {
  const theme = useColorMode();
  const { value } = props;

  return (
    <>
      <Field.Root invalid={!!error}>
        {label && (
          <Field.Label
            className="mb-[5px]!"
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

            MultiValueContainer: ({ children, ...props }) => {
              const { data } = props;
              return (
                <Tag {...props} colorPalette="purple">
                  <div className="flex gap-[5px] items-center">
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
                  <div className="flex flex-col gap-[10px]">
                    {showSelected && (
                      <>
                        <div className="flex flex-col gap-[4px]">
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

                              {value.map((el) => (
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
                                  <Text fontSize="0.9em">{el.label} </Text>
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
                          ) : (
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
                              <Text fontSize="0.9em">{value.label} </Text>
                              <Icon as={MdClear} />
                            </div>
                          )}
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

export default Select;
