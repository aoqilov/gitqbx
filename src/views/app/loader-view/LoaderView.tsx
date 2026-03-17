import LoaderLayout from "@/components/layouts/loader-layout/LoaderLayout";
import Image from "@/components/ui/image/Image";
import Progress from "@/components/ui/progress/Progress";
import { useActions } from "@/hooks/use-actions/useActions";
import { getUser } from "@/service/user-route";
import { Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Preview: FC = () => {
  // ----------------------------  HOOKS
  // ----------------------------  STATE
  // ----------------------------  QUERYS

  // ----------------------------  FUNCTIONS

  const navigate = useNavigate();
  const { setUser } = useActions();
  const [showSubText, setShowSubText] = useState<boolean>(false);
  const [pulseSubText, setPulseSubText] = useState<boolean>(false);
  const [showProgress, setShowProgress] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => {
      setShowProgress(true);
      setTimeout(() => {
        setShowSubText(true);
        setTimeout(() => {
          setPulseSubText(true);

          // TODO:
          setTimeout(() => {
            navigate("/workspace/def/tasks");
          }, 2000);
        }, 1000);
      }, 1000);
    }, 1500);
  }, []);

  const userData = useQuery({
    queryKey: ["getUser"],
    queryFn: () =>
      getUser({
        id: "4",
        type: "id",
      }),
  });
  useEffect(() => {
    if (userData.isSuccess) {
      setUser(userData?.data!.users);
      console.log("User data fetched successfully:", userData.data.users);
      console.log(userData.data?.users);
    }
  }, [userData]);

  return (
    <LoaderLayout>
      <div className="flex flex-col gap-5 w-[70%] text-center">
        <div className="flex justify-center">
          <Image
            className="w-25! animate-fading"
            src="/assets/images/logo.png"
            alt="Логотип"
            objectFit=""
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Progress
            className={showProgress ? "animate-fading" : "opacity-0"}
            value={null}
            size="xxs"
            colorPalette="brand"
          />

          <Text
            fontSize="0.85em"
            color="gray.500"
            className={
              showSubText && !pulseSubText
                ? "animate-fading"
                : showSubText && pulseSubText
                  ? "animate-pulse"
                  : "opacity-0"
            }
          >
            Загрузка данных..
          </Text>
        </div>
      </div>
    </LoaderLayout>
  );
};

export default Preview;
