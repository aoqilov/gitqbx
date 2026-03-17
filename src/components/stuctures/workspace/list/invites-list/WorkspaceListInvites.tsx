import NoData from "@/components/ui/no-data/NoData";
import TemplateList from "@/components/shared/template-list/TemplateList";
import { Button, Icon } from "@chakra-ui/react";
import { AnimatePresence } from "framer-motion";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getWorkspaces } from "@/service/workspace-route";
import { useState } from "react";
import { getInvites, Invite, putInvite } from "@/service/invites-route";
import { RiTelegram2Line } from "react-icons/ri";
import Text from "@/components/ui/typography/Text";
import ListSkeleton from "@/components/ui/skeltion/ListSkeleton";
import { useTranslation } from "@/i18n/languageConfig";

// Minimum kerakli maydonlar

function WorkspaceListInvites<T extends Invite>() {
  // --------------------------------------   HOOKS
  const { t } = useTranslation();
  // --------------------------------------   QUERYS
  const resWorkspacesInvites = useQuery({
    queryKey: ["invites"],
    queryFn: () => getInvites(),
  });
  const putMutation = useMutation({
    mutationFn: (data: {
      workspaceId: number;
      userId: number;
      answer: boolean;
    }) =>
      putInvite({
        workspaceId: data.workspaceId,
        inviteId: data.userId,
        answer: data.answer,
      }),
    onSuccess: () => {
      resWorkspacesInvites.refetch();
    },
    onError: (error) => {
      console.error("Error updating invite:", error);
    },
  });
  // --------------------------------------   STATE
  const resWorkspacesData =
    resWorkspacesInvites?.data?.invites.map((invite) => invite) || [];

  const [selectItem, setSelectItem] = useState<T | null>(null);

  //   ------------------------------------   FUNCTIONS
  async function handleSubmit(item: T) {
    console.log("Accept invite for workspace ID:", item.workspace);
    await putMutation.mutateAsync({
      workspaceId: item.workspace,
      userId: item.id,
      answer: true,
    });
  }

  // --------------------------------------   RENDER

  return (
    <div className="flex flex-col gap-2.5 py-1!">
      <AnimatePresence mode="popLayout">
        {resWorkspacesInvites.isLoading ? (
          <ListSkeleton count={5} />
        ) : resWorkspacesData?.length === 0 ? (
          <div className="flex flex-col items-center gap-2 mt-10">
            <NoData />
          </div>
        ) : (
          resWorkspacesData?.map((item, index) => (
            <TemplateList
              key={item.id}
              item={item}
              index={index}
              onClick={(i: any) => setSelectItem(i as T)}
              activeItem={selectItem as any}
              icon={RiTelegram2Line}
              showIcon
              height="h-10!"
              activeBorderColor="var(--main-color)"
              activeBgColor="transparent"
              renderLeft={() => {
                return (
                  <>
                    <div className=" rounded-full flex items-center justify-center border border-(--main-color) ">
                      <Icon
                        as={RiTelegram2Line}
                        color={"brand.500"}
                        fontSize={20}
                      />
                    </div>
                    <div>
                      <Text
                        fontWeight={"500"}
                        fontSize="0.85em"
                        truncate
                        color={"var(--text-def)"}
                      >
                        {item.workspaces.name}
                      </Text>
                      <Text
                        truncate
                        fontWeight="500"
                        fontSize="0.65em"
                        color={"var(--text-lgray-dgreydark)!"}
                      >
                        {item.workspaces.members.length}{" "}
                        {t("workspace.participants")}
                      </Text>
                    </div>
                  </>
                );
              }}
              renderRight={() => {
                return (
                  <Button
                    size="sm"
                    height="26px"
                    px={5}
                    borderRadius="15px"
                    bg="var(--main-color)"
                    color="white"
                    fontSize="14px"
                    fontWeight="400"
                    _active={{ scale: 0.95 }}
                    loading={putMutation.isPending}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSubmit(item as T);
                    }}
                  >
                    {t("worksspace.pages.listworkspace.accept")}
                  </Button>
                );
              }}
            />
          ))
        )}
      </AnimatePresence>
    </div>
  );
}

export default WorkspaceListInvites;
