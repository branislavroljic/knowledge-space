CREATE SEQUENCE hibernate_sequence INCREMENT 1 MINVALUE 1
    MAXVALUE 9223372036854775807
    START 1
    CACHE 1;


-- Create Knowledge Space Table
CREATE TABLE IF NOT EXISTS public.knowledge_space
(
    id   SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Create Problem Table
CREATE TABLE IF NOT EXISTS public.problem
(
    id                 SERIAL PRIMARY KEY,
    name               VARCHAR(1000) NOT NULL,
    knowledge_space_id INT           NOT NULL,
    CONSTRAINT fk_problem_knowledge_space
        FOREIGN KEY (knowledge_space_id)
            REFERENCES public.knowledge_space (id)
            ON DELETE NO ACTION
            ON UPDATE NO ACTION
);

-- Create Question Table
CREATE TABLE IF NOT EXISTS public.question
(
    id         SERIAL PRIMARY KEY,
    title      VARCHAR(1000) NOT NULL,
    problem_id INT           NOT NULL,
    CONSTRAINT fk_question_problem
        FOREIGN KEY (problem_id)
            REFERENCES public.problem (id)
            ON DELETE NO ACTION
            ON UPDATE NO ACTION
);

-- Create Response Table
CREATE TABLE IF NOT EXISTS public.response
(
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(1000) NOT NULL,
    question_id INT           NOT NULL,
    correct     BOOLEAN       NOT NULL,
    CONSTRAINT fk_response_question
        FOREIGN KEY (question_id)
            REFERENCES question (id)
            ON DELETE NO ACTION
            ON UPDATE NO ACTION
);

-- Create Assessment Test Table
CREATE TABLE IF NOT EXISTS public.assessment_test
(
    id   SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Create Edge Table
CREATE TABLE IF NOT EXISTS public.edge
(
    id           serial primary key,
    from_item_id INT NOT NULL,
    to_item_id   INT NOT NULL,
    CONSTRAINT fk_edge_problem_from
        FOREIGN KEY (from_item_id)
            REFERENCES public.problem (id)
            ON DELETE NO ACTION
            ON UPDATE NO ACTION,
    CONSTRAINT fk_edge_problem_to
        FOREIGN KEY (to_item_id)
            REFERENCES public.problem (id)
            ON DELETE NO ACTION
            ON UPDATE NO ACTION
);

-- Create Assessment Test Question Table
CREATE TABLE IF NOT EXISTS public.assessment_test_question
(
    id                 SERIAL PRIMARY KEY,
    question_id        INT NOT NULL,
    assessment_test_id INT NOT NULL,
    CONSTRAINT fk_assessment_test_question_question
        FOREIGN KEY (question_id)
            REFERENCES public.question (id)
            ON DELETE NO ACTION
            ON UPDATE NO ACTION,
    CONSTRAINT fk_assessment_test_question_assessment_test
        FOREIGN KEY (assessment_test_id)
            REFERENCES public.assessment_test (id)
            ON DELETE NO ACTION
            ON UPDATE NO ACTION
);

-- Create User Table
CREATE TABLE IF NOT EXISTS public.user
(
    id       SERIAL PRIMARY KEY,
    email    VARCHAR(45) NOT NULL,
    password VARCHAR(45) NOT NULL,
    role     smallint
);

-- Create User has Assessment Test Table
CREATE TABLE IF NOT EXISTS public.user_assessment_test
(
    user_id            INT NOT NULL,
    assessment_test_id INT NOT NULL,
    id                 SERIAL PRIMARY KEY,
    CONSTRAINT fk_user_has_assessment_test_user
        FOREIGN KEY (user_id)
            REFERENCES public.user (id)
            ON DELETE NO ACTION
            ON UPDATE NO ACTION,
    CONSTRAINT fk_user_has_assessment_test_assessment_test
        FOREIGN KEY (assessment_test_id)
            REFERENCES public.assessment_test (id)
            ON DELETE NO ACTION
            ON UPDATE NO ACTION
);

-- Create User has Assessment Test Response Table
CREATE TABLE IF NOT EXISTS public.user_assessment_test_response
(
    response_id                 INT NOT NULL,
    user_has_assessment_test_id INT NOT NULL,
    PRIMARY KEY (response_id, user_has_assessment_test_id),
    CONSTRAINT fk_user_has_assessment_test_response_response
        FOREIGN KEY (response_id)
            REFERENCES response (id)
            ON DELETE NO ACTION
            ON UPDATE NO ACTION,
    CONSTRAINT fk_user_has_assessment_test_response_user_has_assessment
        FOREIGN KEY (user_has_assessment_test_id)
            REFERENCES public.user_assessment_test (id)
            ON DELETE NO ACTION
            ON UPDATE NO ACTION
);




