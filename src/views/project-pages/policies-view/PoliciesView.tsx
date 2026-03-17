import TemplateHeader from "@/components/shared/template-header/TemplateHeader";
import { RootState } from "@/store";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import InputForm from "@/components/ui/input/InputForm";
import { TbCopy } from "react-icons/tb";
import {
  SelectCompoent,
  SelectItem,
} from "@/components/ui/select/SelectCompoent";

const PoliciesView = () => {
  // ------------------------------  hooks
  const { projectNameForHeader } = useSelector(
    (state: RootState) => state.params,
  );

  // Включено/Выключено опции — memoized, reference stable
  const yesNoOptions = useMemo<SelectItem[]>(
    () => [
      { value: "yes", label: "Включено" },
      { value: "no", label: "Выключено" },
    ],
    [],
  );

  // ------------------------------  state  (single select → string | number)
  const [autoRenewTasks, setAutoRenewTasks] = useState<string | number>("no");
  const [futureTasks, setFutureTasks] = useState<string | number>("no");
  const [encapsulateEmployeeTasks, setEncapsulateEmployeeTasks] = useState<
    string | number
  >("no");
  const [mandatoryExecutor, setMandatoryExecutor] = useState<string | number>(
    "no",
  );
  const [telegramChat, setTelegramChat] = useState<string>("");

  console.log("autoRenewTasks:", autoRenewTasks);
  console.log("futureTasks:", futureTasks);
  console.log("encapsulateEmployeeTasks:", encapsulateEmployeeTasks);
  console.log("mandatoryExecutor:", mandatoryExecutor);

  // ------------------------------  function
  return (
    <div className="flex flex-col ">
      <div className="mt-5!">
        <TemplateHeader
          title="Политика проекта"
          subText={projectNameForHeader}
          showBack={true}
        />
        <div className="mt-8! flex flex-col gap-4 max-w-2xl">
          <SelectCompoent
            label="Автоматическое продление задач"
            items={yesNoOptions}
            value={autoRenewTasks}
            onValueChange={setAutoRenewTasks}
            placeholder="Выберите вариант"
            isRequired
            isClearable={false}
          />

          <SelectCompoent
            label="Возможность выполнять задачи на будущее"
            items={yesNoOptions}
            value={futureTasks}
            onValueChange={setFutureTasks}
            placeholder="Выберите вариант"
            isRequired
            isClearable={false}
          />

          <SelectCompoent
            label="Инкапсулирование задач сотрудника"
            items={yesNoOptions}
            value={encapsulateEmployeeTasks}
            onValueChange={setEncapsulateEmployeeTasks}
            placeholder="Выберите вариант"
            isRequired
            isClearable={false}
          />

          <SelectCompoent
            label="Обязательное прикрепление исполнителя"
            items={yesNoOptions}
            value={mandatoryExecutor}
            onValueChange={setMandatoryExecutor}
            placeholder="Выберите вариант"
            isRequired
            isClearable={false}
          />

          <InputForm
            label="Привязанный чат Telegram"
            value={telegramChat}
            onChange={(e) => setTelegramChat(e.target.value)}
            placeholder="Введите ID чата или имя пользователя"
            isRequired
            disabled
            extraIcon={TbCopy}
            onExtraIconClick={() => {
              navigator.clipboard.writeText(telegramChat);
              console.log("Скопировано в буфер обмена:", telegramChat);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PoliciesView;
