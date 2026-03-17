import Text from "@/components/ui/typography/Text";
import { useWorkspaceDynamicNames } from "@/hooks/use-workspace-menu/useWorkspaceDynamicNames";
import { RootState } from "@/store";
import { globalParams } from "@/utils/globalParams";
import { FC, PropsWithChildren } from "react";
import { useSelector } from "react-redux";

const PageLayout: FC<PropsWithChildren<unknown>> = ({ children }) => {
  const { workspaceMode, menuMode, workspaceName } = useSelector(
    (state: RootState) => state.params,
  );
  const { projectID, workspaceID } = globalParams();
  const { mode } = useWorkspaceDynamicNames();
  return (
    <div className="mt-5!">
      {/* <div className="fixed bottom-0 left-0 w-full bg-[#f0f0f0f5] z-10 p-4! rounded-b-[20px]! shadow-md! flex justify-between">
        <Text>
          <div>workspaceMode: {workspaceMode}</div>
          <div>menuMode: {menuMode}</div>
          <div>menuSelectSection: {workspaceName ?? "----"}</div>
        </Text>
        <Text className="ml-4!">
          <div>workspaceID: {workspaceID}</div>
          <div>projectID: {projectID}</div>
          <div>dynamic mode: {mode}</div>
        </Text>
      </div> */}

      {children}
    </div>
  );
};

export default PageLayout;
