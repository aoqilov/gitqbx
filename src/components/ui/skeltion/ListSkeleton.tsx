import { Flex, Skeleton, SkeletonCircle } from "@chakra-ui/react";

interface WorkspaceItemSkeletonProps {
  count?: number;
}

function ListSkeleton({ count = 3 }: WorkspaceItemSkeletonProps) {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <Flex
          key={i}
          align="center"
          justify="space-between"
          px="16px"
          height="40px"
          border="1px solid var(--border-list)"
          borderRadius="10px"
        >
          {/* Left side */}
          <Flex align="center" gap="12px">
            {/* Icon skeleton */}
            <SkeletonCircle size="24px" />

            {/* Title skeleton */}
            <div className="flex flex-col gap-2">
              <Skeleton height="10px" width="160px" borderRadius="6px" />
              <Skeleton height="8px" width="80px" borderRadius="6px" />
            </div>
          </Flex>

          {/* Right text skeleton */}
          <Skeleton height="12px" width="90px" borderRadius="6px" />
        </Flex>
      ))}
    </div>
  );
}

export default ListSkeleton;
