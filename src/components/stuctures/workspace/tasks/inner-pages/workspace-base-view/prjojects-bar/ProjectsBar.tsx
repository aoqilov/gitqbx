import Text from "@/components/ui/typography/Text";
import { Icon } from "@chakra-ui/react";
import { RiFilter2Fill } from "react-icons/ri";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { getProjects } from "@/service/projects-route";
import { globalParams } from "@/utils/globalParams";
import { useEffect, useState } from "react";
import { useActions } from "@/hooks/use-actions/useActions";

const ProjectsBar = ({
  handleGetProjectItem,
  selectedProjectID,
}: {
  handleGetProjectItem: (projectID: number) => void;
  selectedProjectID: number | null;
}) => {
  // ------------------------------------------ HOOKS
  const {
    setProjectRoles,
    setProjectTagsGroup,
    setProjectTags,
    setProjectThemes,
    setProjectStatuses,
  } = useActions();
  const { workspaceID } = globalParams();

  // ------------------------------------------ QUERYS
  const resProjectsByWorkspace = useQuery({
    queryKey: ["projects", workspaceID],
    queryFn: async () => getProjects(workspaceID!),
  });
  // ------------------------------------------ STATES
  const projectData = resProjectsByWorkspace.data?.projects;
  const [selectItem, setSelectItem] = useState<Project | null>(null);

  console.log(selectItem);
  // ------------------------------------------ FUNCTIONS

  useEffect(() => {
    if (selectItem) {
      setProjectRoles({
        projectId: selectItem.id,
        roles: selectItem.roles,
      });
      setProjectTagsGroup({
        projectId: selectItem.id,
        tagsGroup: selectItem.tagsGroup,
      });
      selectItem.tagsGroup.forEach((group) => {
        setProjectTags({
          projectId: group.id,
          tags: group.tags,
        });
      });
      setProjectThemes({
        projectId: selectItem.id,
        themes: selectItem.themes,
      });
      setProjectStatuses({
        projectId: selectItem.id,
        statuses: selectItem.statuses,
      });
    }
  }, [selectItem, selectedProjectID]);
  return (
    <div className="h-[28px]! w-full! flex items-center">
      <div
        className=" h-7! px-1! rounded-full flex items-center justify-center border! border-(--border-input)! cursor-pointer "
        onClick={() => console.log("filter")}
      >
        <Icon as={RiFilter2Fill} color="var(--border-input)" fontSize={20} />
      </div>

      <div className="flex gap-1.25! ml-2.5! overflow-x-auto">
        {projectData?.map((project) => {
          const isActive = project.id === selectedProjectID;

          return (
            <div
              key={project.id}
              onClick={() => {
                setSelectItem(project);
                handleGetProjectItem(project.id);
              }}
              className={`px-6! h-[28px]! rounded-[30px]! border! flex items-center justify-center cursor-pointer transition-all ${
                isActive
                  ? "border-transparent!"
                  : "transparent! border-[#711CE9]!"
              }`}
              style={
                isActive
                  ? {
                      background: " #711CE9 ",
                    }
                  : undefined
              }
            >
              <Text
                color={isActive ? "white" : "#7A3FF2"}
                fontSize="1em"
                fontWeight="500"
                lineHeight="10px"
                whiteSpace="nowrap"
              >
                {project.name}
              </Text>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectsBar;
