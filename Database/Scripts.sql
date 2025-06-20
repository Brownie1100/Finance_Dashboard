CREATE TABLE IF NOT EXISTS users
(
    id bigint NOT NULL,
    email character varying(255) COLLATE "default",
    name character varying(255) COLLATE "default",
    password character varying(255) COLLATE "default",
    CONSTRAINT users_pkey PRIMARY KEY (id)
)
CREATE SEQUENCE IF NOT EXISTS goals_tracker_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

CREATE TABLE IF NOT EXISTS expense_tracker
(
    id bigint NOT NULL GENERATED BY DEFAULT AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    amount double precision,
    category character varying(255) COLLATE "default",
    date date,
    description character varying(255) COLLATE "default",
    user_id bigint,
    CONSTRAINT expense_tracker_pkey PRIMARY KEY (id)
)
CREATE SEQUENCE IF NOT EXISTS expense_tracker_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

CREATE TABLE IF NOT EXISTS income_tracker
(
    id bigint NOT NULL GENERATED BY DEFAULT AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    amount double precision,
    category character varying(255) COLLATE "default",
    date date,
    description character varying(255) COLLATE "default",
    user_id bigint,
    CONSTRAINT income_tracker_pkey PRIMARY KEY (id)
)
CREATE SEQUENCE IF NOT EXISTS income_tracker_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

CREATE TABLE IF NOT EXISTS goals_tracker
(
    id bigint NOT NULL GENERATED BY DEFAULT AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    amount double precision,
    category character varying(255) COLLATE "default",
    description character varying(255) COLLATE "default",
    end_date date,
    start_date date,
    type character varying(255) COLLATE "default",
    user_id bigint,
    CONSTRAINT goals_tracker_pkey PRIMARY KEY (id)
)
CREATE SEQUENCE IF NOT EXISTS public.goals_tracker_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;
