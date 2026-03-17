import HeadingPageTitle from "@/components/ui/typography/HeadingPageTitle";
import Text from "@/components/ui/typography/Text";
import { useTranslation } from "@/i18n/languageConfig";
import { RootState } from "@/store";
import { globalParams } from "@/utils/globalParams";
import { Icon, Span } from "@chakra-ui/react";
import React from "react";
import { BiArrowBack } from "react-icons/bi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

interface HeaderState {
  title: string;
  subText?: string;
  importance?: string;
  showBack?: boolean;
  onBackClick?: () => void; // custom handler
  toBackTask?: boolean; // navigate to tasks if true
}

const TemplateHeader = ({
  title,
  subText,
  importance = "",
  showBack = false,
  toBackTask = false,
  onBackClick,
}: HeaderState) => {
  const { t: tproject } = useTranslation();
  const navigate = useNavigate();
  const { projectID, workspaceID } = globalParams();
  const { workspaceMode } = useSelector((state: RootState) => state.params);

  function navigateToBackTask() {
    navigate(`/workspace/${workspaceID}/tasks`);
  }

  const handleBack = () => {
    if (onBackClick) {
      onBackClick(); // custom function
    } else {
      toBackTask ? navigateToBackTask() : navigate(-1); // default behavior
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {showBack && (
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center border! border-(--main-color)!"
              onClick={handleBack}
            >
              <Icon as={BiArrowBack} color="brand.500" fontSize={26} />{" "}
            </div>
          )}

          <div>
            <HeadingPageTitle className="mb-1">{title}</HeadingPageTitle>

            {subText && (
              <Text color="var(--text-subtext)">
                {tproject("workspace.pages.projectsws.title")}:{" "}
                <Span fontSize="0.9em" color="brand.500">
                  {subText}
                </Span>
                {importance && (
                  <Span fontSize="0.9em" color="brand.500">
                    <b>{" / "}</b>
                    {importance}
                  </Span>
                )}
              </Text>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateHeader;
