import { FaTrash } from "react-icons/fa";
import { CardContainer, CardDeadline, CardTitle } from "../styles/styled";

interface CardProps {
  id: string;
  title: string;
  description?: string;
  due_date?: string;
}

export default function Card({ title, due_date }: CardProps) {
  return (
    <CardContainer>
      <CardTitle>
        <span>{title}</span>
        <button>
          <FaTrash />
        </button>
      </CardTitle>
      <CardDeadline>{due_date}</CardDeadline>
    </CardContainer>
  );
}
