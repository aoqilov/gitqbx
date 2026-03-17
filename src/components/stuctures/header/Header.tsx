import Avatar from "@/components/ui/avatar/Avatar";
import Heading from "@/components/ui/typography/Heading";
import Subtext from "@/components/ui/typography/SubText";
import { RootState } from "@/store";
import { FC } from "react";
import { useSelector } from "react-redux";
import Menu from "../menu/Menu";

const Header: FC = () => {
  const user = useSelector((state: RootState) => state.user);

  return (
    <div className="flex items-center justify-between">
      <Menu />

      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end">
          <Heading fontSize="sm">{user.user?.fullname || "fullname"}</Heading>
          <Subtext>@{user.user?.telegram_username || "username"}</Subtext>
        </div>

        <div>
          <Avatar
            ring="ringBrand"
            fullName={user.user?.fullname!}
            avatar={user.user?.telegram_avatar!}
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
