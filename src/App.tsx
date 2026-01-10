import { useQuery } from "@tanstack/react-query";
import { getColumns } from "./features/column/api/getColumns";
import Column from "./features/column/components/Column";
import styled from "@emotion/styled";
import AdditionColumnButton from "./features/column/components/AdditionColumnButton";
import CreateColumnForm from "./features/column/components/CreateColumnForm";
import { useState } from "react";

const BoardContainer = styled.div`
  width: 100%;
  display: flex;
  gap: 1rem;
  height: 100vh;
  padding: 40px;
  overflow-x: scroll;
`;

function App() {
  const [open, setOpen] = useState(false);
  const { data: columns } = useQuery({
    queryKey: ["columns"],
    queryFn: () => getColumns(),
    staleTime: 60 * 60 * 1000,
  });

  return (
    <BoardContainer>
      {columns?.map((column) => (
        <Column key={column.id} id={column.id} title={column.title} />
      ))}
      <CreateColumnForm open={open} onClose={() => setOpen(false)} />
      <AdditionColumnButton emptyColumn={columns?.length === 0} onClick={() => setOpen(true)} />
    </BoardContainer>
  );
}

export default App;
