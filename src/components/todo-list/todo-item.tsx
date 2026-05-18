import { Button } from "../ui/button";
import { Link } from "react-router";
import { useUpdateTodoMutation } from "@/hooks/mutations/use-update-todo-mutation";
import { useDelete } from "@/hooks/mutations/use-delete-todo-mutation";
import { useTodoDataById } from "@/hooks/quries/use-todo-data-by-id";

export default function TodoItem({ id }: { id: string }) {
  const { data: todo } = useTodoDataById(id, "LIST");
  if (!todo) throw new Error("Todo Data Undefined");
  const { content, isDone } = todo;
  const { mutate: deleteTodo, isPending: isDeleteTodoPending } = useDelete();
  const { mutate: UpdateTodo } = useUpdateTodoMutation();
  const handleDeleteClick = () => {
    deleteTodo(id);
  };
  const hadleCheckboxClick = () => {
    UpdateTodo({
      id,
      isDone: !isDone,
    });
  };

  return (
    <div className={"flex items-center justify-between border p-2"}>
      <div className="flex gap-5">
        <input
          disabled={isDeleteTodoPending}
          type="checkbox"
          checked={isDone}
          onClick={hadleCheckboxClick}
        />
        <Link to={`/todolist/${id}`}>{content}</Link>
      </div>
      <Button
        disabled={isDeleteTodoPending}
        variant={"destructive"}
        onClick={handleDeleteClick}
      >
        삭제
      </Button>
    </div>
  );
}
