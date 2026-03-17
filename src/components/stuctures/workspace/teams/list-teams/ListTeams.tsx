import TemplateList from "@/components/shared/template-list/TemplateList";
import NoData from "@/components/ui/no-data/NoData";
import ListSkeleton from "@/components/ui/skeltion/ListSkeleton";
import { getTeams } from "@/service/teams-route";
import { globalParams } from "@/utils/globalParams";
import { useActions } from "@/hooks/use-actions/useActions";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useRef } from "react";
import { MdOutlineOutlinedFlag } from "react-icons/md";
import { useTranslation } from "@/i18n/languageConfig";

const ListTeams = ({
  setIsSelectionMode,
  setSelectedItems,
  selectedItems,
  isSelectionMode,
}: {
  setIsSelectionMode: (value: boolean) => void;
  setSelectedItems: React.Dispatch<React.SetStateAction<Team[]>>;
  selectedItems: Team[];
  isSelectionMode: boolean;
}) => {
  // --------------------------------------   HOOKS
  const { t } = useTranslation("workspace.pages.teamsws.");
  const pressTimer = useRef<NodeJS.Timeout | null>(null);
  const { workspaceID } = globalParams();
  const { setTeams } = useActions();

  // --------------------------------------   QUERIES
  const resListTeams = useQuery({
    queryKey: ["list-teams"],
    queryFn: async () => {
      const data = await getTeams({ workspaceID: workspaceID! });
      return data;
    },
  });

  useEffect(() => {
    if (resListTeams.data?.teams) {
      setTeams(resListTeams.data.teams);
    }
  }, [resListTeams.data]);

  const teamsArray = resListTeams?.data?.teams;
  console.log(teamsArray);
  // --------------------------------------   STATE
  //
  //
  const handlePressStart = (item: Team) => {
    pressTimer.current = setTimeout(() => {
      setIsSelectionMode(true);
      setSelectedItems([item]);
    }, 800);
  };

  const handlePressEnd = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  const handleCheckboxChange = (item: Team) => {
    setSelectedItems((prev) => {
      const isSelected = prev.some((selected) => selected.id === item.id);

      if (isSelected) {
        const newItems = prev.filter((selected) => selected.id !== item.id);

        // Agar hech qanday item qolmasa, selection mode'ni o'chiramiz
        if (newItems.length === 0) {
          setIsSelectionMode(false);
        }

        return newItems;
      } else {
        return [...prev, item];
      }
    });
  };
  return (
    <div className="flex flex-col gap-1.5">
      {resListTeams.isLoading ? (
        <ListSkeleton count={5} />
      ) : teamsArray?.length === 0 ? (
        <NoData />
      ) : (
        teamsArray?.map((item, index) => (
          <TemplateList
            key={item.id}
            selectable
            isSelectionMode={isSelectionMode}
            isSelected={selectedItems.some((s) => s.id === item.id)}
            onPressStart={handlePressStart}
            onPressEnd={handlePressEnd}
            onCheckboxChange={handleCheckboxChange}
            onClick={(item) => console.log("Clicked:", item)}
            showIcon
            icon={MdOutlineOutlinedFlag}
            rightText={item.members.length + t("participants")}
            primaryText={item.name}
            item={item}
            index={index}
          />
        ))
      )}
    </div>
  );
};

export default ListTeams;
