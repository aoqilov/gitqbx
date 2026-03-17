import PageLayout from "@/components/layouts/page-layout/PageLayout";
import DeviceListTemplate, {
  TypeDevice,
} from "@/components/shared/device-list-template";
import TemplateHeader from "@/components/shared/template-header/TemplateHeader";
import Button from "@/components/ui/buttons/Button";
import ScrollArea from "@/components/ui/scroll-area/SrcollArea";
import SelectAvatarCheck, {
  OptionWithImage,
} from "@/components/ui/select/SelectAvatarCheck";
import { SelectCompoent } from "@/components/ui/select/SelectCompoent";
import Text from "@/components/ui/typography/Text";
import { useGetStoreAllWorkspace } from "@/hooks/use-store-data";
import { Icon } from "@chakra-ui/react";
import { FC, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { MdOutlineKeyboardBackspace } from "react-icons/md";

const deviceList: TypeDevice[] = [
  {
    id: "1",
    name: "Android A55 by Xion",
    type: "mobile",
    subText: "Последний заход",
    lastLogin: "19.01.2025 1:16",
  },
  {
    id: "2",
    name: "PC Win10 RAKH",
    type: "pc",
    subText: "Последний заход",
    lastLogin: "19.01.2025 1:16",
  },
  {
    id: "3",
    name: "PC Win12 RAKH",
    type: "pc",
    subText: "Последний заход",
    lastLogin: "16.01.2025 1:16",
  },
  {
    id: "4",
    name: "PC Win11 RAKH",
    type: "pc",
    subText: "Последний заход",
    lastLogin: "29.01.2025 4:16",
  },
];

type FormValues = {
  membersId: number[];
  teamsId: number[];
};

const mockMembers = [
  {
    label: "Ali Valiyev",
    value: "1",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    label: "Sardor Karimov",
    value: "2",
    avatar: "https://i.pravatar.cc/150?img=2",
  },
  {
    label: "Jasur Xasanov",
    value: "3",
    avatar: "https://i.pravatar.cc/150?img=3",
  },
  {
    label: "Dilshod Rakhimov",
    value: "4",
    avatar: "https://i.pravatar.cc/150?img=4",
  },
  {
    label: "Bekzod Tursunov",
    value: "5",
    avatar: "https://i.pravatar.cc/150?img=5",
  },
];
import { FiUser, FiSettings, FiShield, FiBriefcase } from "react-icons/fi";
import { useTranslation } from "@/i18n/languageConfig";

const mockTeams = [
  {
    label: "team 1",
    value: "1",
    icon: FiUser,
  },
  {
    label: "team 2",
    value: "2",
    icon: FiSettings,
  },
  {
    label: "team 3",
    value: "3",
    icon: FiShield,
  },
  {
    label: "team 4",
    value: "4",
    icon: FiBriefcase,
  },
];

const WorkSyncDeviceView: FC = () => {
  const { t } = useTranslation("workspace.pages.syncws.");
  const { members } = useGetStoreAllWorkspace();

  const [openSelect, setOpenSelect] = useState<string | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<TypeDevice | null>(null);

  const { handleSubmit, control } = useForm<FormValues>({
    defaultValues: {
      membersId: [],
      teamsId: [],
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log(data);
  };
  const [teamsSearch, setTeamsSearch] = useState("");

  const filteredTeams = useMemo(() => {
    const q = teamsSearch.trim().toLowerCase();
    if (!q) return mockTeams;

    return mockTeams.filter((team) => team.label.toLowerCase().includes(q));
  }, [teamsSearch]);

  return (
    <PageLayout>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full min-h-[calc(100vh-80px)] relative"
      >
        <div className="pt-5">
          <TemplateHeader title={t("title")} showBack />
        </div>

        <ScrollArea
          size={"xs"}
          orientation="vertical"
          className="max-h-[70vh]! w-full mt-5!  "
          isShow={false}
        >
          <DeviceListTemplate
            devices={deviceList}
            selectItem={selectedDevice}
            setSelectItem={setSelectedDevice}
          />
        </ScrollArea>
      </form>
    </PageLayout>
  );
};

export default WorkSyncDeviceView;
