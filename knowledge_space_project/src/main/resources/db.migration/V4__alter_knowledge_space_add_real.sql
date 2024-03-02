alter table public.knowledge_space
    add column is_real boolean not null default false,
    ADD COLUMN assessment_test_id int;

CREATE TABLE IF NOT EXISTS public.knowledge_space_problem
(
    id                 SERIAL PRIMARY KEY,
    knowledge_space_id INT NOT NULL,
    problem_id         INT NOT NULL,
    CONSTRAINT fk_knowledge_space_problem_knowledge_space
        FOREIGN KEY (knowledge_space_id)
            REFERENCES public.knowledge_space (id)
            ON DELETE NO ACTION
            ON UPDATE NO ACTION,
    CONSTRAINT fk_knowledge_space_problem_problem
        FOREIGN KEY (problem_id)
            REFERENCES public.problem (id)
            ON DELETE NO ACTION
            ON UPDATE NO ACTION
);