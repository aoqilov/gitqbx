import TemplateList from "@/components/shared/template-list/TemplateList";
import Button from "@/components/ui/buttons/Button";
import NoData from "@/components/ui/no-data/NoData";
import { useTranslation } from "@/i18n/languageConfig";
import { getInviteByIdWorkspaceCalled, Invite } from "@/service/invites-route";
import { RootState } from "@/store";
import { globalParams } from "@/utils/globalParams";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import React from "react";
import { useSelector } from "react-redux";

const ListCalled = () => {
  // --------------------------------  HOOKS
  const { t } = useTranslation("workspace.pages.membersws.");
  const { user } = useSelector((state: RootState) => state.user);
  const { workspaceID } = globalParams();
  // --------------------------------  QUERY
  const resInvitesCalled = useQuery({
    queryKey: ["invites-called"],
    queryFn: async () =>
      getInviteByIdWorkspaceCalled({
        workspaceId: workspaceID!,
      }),
  });
  // --------------------------------  STATE
  const [selectInvite, setSelectInvite] = React.useState<Invite | null>(null);

  const invitesCalledData: Invite[] = resInvitesCalled?.data?.invites || [];

  // --------------------------------  FUNCTIONS
  const handleCancelInvite = (invite: Invite) => {
    // Agar o'chirilgan item active bo'lsa, active holatni tozalash
    if (selectInvite?.id === invite.id) {
      setSelectInvite(null);
    }
  };

  return (
    <div className="flex flex-col gap-2.5 py-1!">
      <AnimatePresence>
        {invitesCalledData.length === 0 ? (
          <div className="min-h-[calc(100vh-300px)]! flex items-center">
            <NoData />
          </div>
        ) : (
          invitesCalledData.map((invite, index) => (
            <TemplateList
              key={invite.id}
              item={invite}
              index={index}
              onClick={(item) => {
                setSelectInvite(item);
              }}
              //   showAvatar
              //   avatarName={invite.workspace.}
              //   avatarSrc={invite.avatarImg}
              primaryText={invite.id.toString()}
              secondaryText={invite.user.toString()}
              renderRight={(item) => (
                <>
                  <Button
                    size="sm"
                    height="26px"
                    px={5}
                    borderRadius="15px"
                    bg="var(--main-color)"
                    color="white"
                    fontSize="0.85em"
                    fontWeight="400"
                    _active={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCancelInvite(item);
                    }}
                  >
                    {t("btncancel")}
                  </Button>
                </>
              )}
            />
          ))
        )}
      </AnimatePresence>
    </div>
  );
};

export default ListCalled;
