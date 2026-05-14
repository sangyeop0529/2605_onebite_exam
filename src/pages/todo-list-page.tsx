import TodoEditor from "@/components/todo-list/todo-editor";
import TodoItem from "@/components/todo-list/todo-item";

const dummyTodos = [
  { id: 1, content: "todo 1" },
  { id: 2, content: "todo 2" },
  { id: 3, content: "todo 3" },
];

export default function TodoListPage() {
  return (
    <div className={"flex flex-col gap-5 p-5"}>
      <h1 className={"text-2xl font-bold"}>TodoList</h1>
      <TodoEditor />
      {dummyTodos.map((todo) => (
        <TodoItem key={todo.id} {...todo} />
      ))}
    </div>
  );
}
