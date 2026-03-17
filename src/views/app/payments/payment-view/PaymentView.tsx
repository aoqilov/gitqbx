import PageLayout from "@/components/layouts/page-layout/PageLayout";
import PaymentStoryListTemplate, {
  TypePayment,
} from "@/components/shared/payment-storylist-template";
import TemplateHeader from "@/components/shared/template-header/TemplateHeader";
import PaymentCardsPin from "@/components/stuctures/app/payment-view/PaymentCardsPin";

import Button from "@/components/ui/buttons/Button";
import ScrollArea from "@/components/ui/scroll-area/SrcollArea";
import SegmentComponent from "@/components/ui/segment/SegmentComponent";
import Text from "@/components/ui/typography/Text";
import { useTranslation } from "@/i18n/languageConfig";
import { Icon } from "@chakra-ui/react";
import { FC, useState } from "react";

import { MdOutlineKeyboardBackspace } from "react-icons/md";

const projectsData: TypePayment[] = [
  {
    id: "0",
    name: "Mustang Юнусабад (Янгитарнов ..",
    adrees: "Ташкент, Юнусабадский р-он, МСГ Янгитарнов",
    date: `15.01.2024`,
    time: `18:50`,
    sum: "34 000",
    image: "/public/assets/images/ubank.png",
  },

  {
    id: "12",
    name: "Mustang Юнусабад (Янгитарнов ..",
    adrees: "Ташкент, Юнусабадский р-он, МСГ Янгитарнов",
    date: `18.01.2024`,
    time: `18:50`,
    sum: "34 000",
    image: "/public/assets/images/click-icon.png",
  },
  {
    id: "13",
    name: "Mustang Юнусабад (Янгитарнов ..",
    adrees: "Ташкент, Юнусабадский р-он, МСГ Янгитарнов",
    date: `18.01.2024`,
    time: `18:50`,
    sum: "34 000",
    image: "/public/assets/images/ubank.png",
  },
  {
    id: "11",
    name: "Mustang Юнусабад (Янгитарнов wqeewe eqwe qweqe qww ",
    adrees: "Ташкент, Юнусабадский р-он, МСГ Янгитарнов",
    date: `19.01.2024`,
    time: `18:50`,
    sum: "34 000",
    image: "/public/assets/images/ubank.png",
  },
  {
    id: "112",
    name: "Mustang Юнусабад (Янгитарнов ..",
    adrees: "Ташкент, Юнусабадский р-он, МСГ Янгитарнов",
    date: `19.01.2024`,
    time: `18:50`,
    sum: "34 000",
    image: "/public/assets/images/ubank.png",
  },
  {
    id: "113",
    name: "Mustang Юнусабад (Янгитарнов ..",
    adrees: "Ташкент, Юнусабадский р-он, МСГ Янгитарнов",
    date: `20.01.2024`,
    time: `18:50`,
    sum: "34 000",
    image: "/public/assets/images/ubank.png",
  },
];
const PaymentView: FC = () => {
  // ---------------------------  VARIABLES
  const { t } = useTranslation("workspace.pages.payment.");

  const segmentOptions = [
    { label: t("segmenthistory"), value: "history" },
    { label: t("segmentcard"), value: "cards" },
  ];
  // ---------------------------  HOOKS
  // ---------------------------  STATES
  const [selectedProject, setSelectedProject] = useState<TypePayment | null>(
    null,
  );
  const [selectedSegment, setSelectedSegment] = useState<string>("history");

  // ---------------------------  FUNCTIONS
  return (
    <>
      <PageLayout>
        <div className="w-full min-h-[calc(100vh-80px)]!  relative ">
          <TemplateHeader title={t("title")} showBack={true} />
          <div className="mt-5!">
            <SegmentComponent
              options={segmentOptions}
              value={selectedSegment}
              onChange={(value) => setSelectedSegment(value)}
            />
          </div>

          <ScrollArea
            size={"xs"}
            orientation="vertical"
            className="h-[calc(100vh-210px)]! w-full mt-5!  "
            isShow={false}
          >
            {selectedSegment === "history" ? (
              <PaymentStoryListTemplate
                devices={projectsData}
                selectItem={selectedProject}
                setSelectItem={setSelectedProject}
              />
            ) : (
              <PaymentCardsPin />
            )}
          </ScrollArea>
        </div>
      </PageLayout>
    </>
  );
};

export default PaymentView;
