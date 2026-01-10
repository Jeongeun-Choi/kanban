import { useQuery } from "@tanstack/react-query";
import { getColumns } from "./features/column/api/getColumns";
import Column from "./features/column/components/Column";
import styled from "@emotion/styled";

const BoardContainer = styled.div`
  width: 100%;
  display: flex;
  gap: 1rem;
  height: 100vh;
  padding: 40px;
`;

function App() {
  const { data: columns } = useQuery({
    queryKey: ["columns"],
    queryFn: () => getColumns(),
    staleTime: 60 * 60 * 1000,
  });

  return (
    <BoardContainer>
      {columns?.map((column) => (
        <Column key={column.id} title={column.title} />
      ))}
    </BoardContainer>
  );
}

export default App;
