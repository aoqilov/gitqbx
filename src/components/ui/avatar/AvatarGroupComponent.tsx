import { FC } from "react"
import { Avatar, AvatarGroup } from "@chakra-ui/react"

interface AvatarItem {
  name: string
  src?: string
}

interface DynamicAvatarGroupProps {
  avatars: AvatarItem[]
  size?: "xs" | "sm" | "md" | "lg" | "xl" | string
  gap?: number
  overlap?: number
  max?: number
  showBorder?: boolean
  showMore?: boolean
}

/**
 * Dynamic Avatar Group Component
 */
const AvatarGroupComponent: FC<DynamicAvatarGroupProps> = ({
  avatars,
  size = "md",
  gap = 0,
  overlap = -3,
  max = 5,
  showBorder = false,
  showMore = true,
}) => {
  const visibleAvatars = avatars.slice(0, max)
  const restCount = avatars.length - max

  return (
    <AvatarGroup
      size={size}
      gap={gap}
      spaceX={overlap}
    >
      {visibleAvatars.map((avatar, index) => (
        <Avatar.Root
          key={index}
          variant={showBorder ? "outline" : "solid"}
        >
          <Avatar.Fallback name={avatar.name} />
          {avatar.src && <Avatar.Image src={avatar.src} />}
        </Avatar.Root>
      ))}

      {showMore && restCount > 0 && (
        <Avatar.Root>
          <Avatar.Fallback>+{restCount}</Avatar.Fallback>
        </Avatar.Root>
      )}
    </AvatarGroup>
  )
}

export default AvatarGroupComponent