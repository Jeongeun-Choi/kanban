import styled from "@emotion/styled";
import Skeleton from "../../../shared/components/Loading/Skeleton";
import * as Styled from "../../column/styles/styled";
import { SKELETON_COUNTS } from "../../../shared/constants/index";

const SkeletonColumn = styled(Styled.ColumnContainer)`
  pointer-events: none;
`;

const SkeletonCard = styled.div`
  width: 100%;
  border-radius: 4px;
  padding: 1rem;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 0.5rem;
`;

export default function BoardSkeleton() {
  return (
    <>
      {Array.from({ length: SKELETON_COUNTS.COLUMNS }).map((_, i) => (
        <SkeletonColumn key={i}>
          <Styled.ColumnHeader>
            <Skeleton width="120px" height="24px" />
          </Styled.ColumnHeader>
          <Styled.ColumnContent>
            {Array.from({ length: SKELETON_COUNTS.CARDS }).map((_, j) => (
              <SkeletonCard key={j}>
                <Skeleton width="80%" height="18px" />
                <div style={{ marginTop: "10px" }}>
                  <Skeleton width="40%" height="12px" />
                </div>
              </SkeletonCard>
            ))}
          </Styled.ColumnContent>
          <Styled.ColumnFooter>
            <Skeleton width="100%" height="48px" borderRadius="8px" />
          </Styled.ColumnFooter>
        </SkeletonColumn>
      ))}
      <div style={{ width: "280px" }}>
        <Skeleton width="280px" height="50px" borderRadius="8px" />
      </div>
    </>
  );
}
