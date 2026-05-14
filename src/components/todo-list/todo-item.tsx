import { useDeleteTodo } from "@/store/todos";
import { Button } from "../ui/button";

export default function TodoItem({
  id,
  content,
}: {
  id: number;
  content: string;
}) {
  const deleteTodo = useDeleteTodo();
  const handleDelete = () => {
    deleteTodo(id);
  };
  return (
    <div className={"flex items-center justify-between border p-2"}>
      {content}
      <Button variant={"destructive"} onClick={handleDelete}>
        삭제
      </Button>
    </div>
  );
}
