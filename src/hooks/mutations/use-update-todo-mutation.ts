import { updateTodo } from "@/api/update-todo";
import { QUERY_KEYS } from "@/lib/constants";
import type { Todo } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateTodoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTodo,
    onMutate: async (updatedTodo) => {
      // 1. 진행 중인 리스트 요청이 있다면 취소합니다.
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.todo.list,
      });
      // 2. 만약 실패했을 때를 대비해 기존 캐시 데이터를 복사(백업)해 둡니다.
      const prevTodos = queryClient.getQueryData<Todo[]>(QUERY_KEYS.todo.list);

      // 3. 서버 응답을 기다리지 않고, 화면(캐시)을 새 데이터로 즉시 변경합니다.
      queryClient.setQueryData<Todo[]>(QUERY_KEYS.todo.list, (prevTodos) => {
        if (!prevTodos) return [];
        return prevTodos.map((prevTodo) =>
          prevTodo.id === updatedTodo.id
            ? { ...prevTodo, ...updatedTodo }
            : prevTodo,
        );
      });

      // 4. 백업한 기존 데이터를 반환(return)합니다. 이 값은 onError의 'context'로 전달됩니다.
      return {
        prevTodos,
      };
    },
    onError: (error, variable, context) => {
      // onMutate에서 반환했던 prevTodos(백업본)가 있다면
      if (context && context.prevTodos) {
        // 캐시 데이터를 실패하기 전 원래 상태로 되돌립니다.
        queryClient.setQueryData<Todo[]>(
          QUERY_KEYS.todo.list,
          context.prevTodos,
        );
      }
    },
    onSettled: () => {
      // 서버 데이터와 프론트엔드 캐시 데이터의 완벽한 싱크를 위해 쿼리를 만료시킵니다.
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.todo.list,
      });
    },
  });
}
