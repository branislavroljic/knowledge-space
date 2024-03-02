
ALTER TABLE public.problem
    DROP CONSTRAINT IF EXISTS fk_problem_knowledge_space;

ALTER TABLE public.problem
    DROP column IF EXISTS knowledge_space_id;