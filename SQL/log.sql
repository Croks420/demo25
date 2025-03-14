-- Table: public.logs

-- DROP TABLE IF EXISTS public.logs;

CREATE TABLE IF NOT EXISTS public.logs
(
    id integer NOT NULL DEFAULT nextval('logs_id_seq'::regclass),
    title character varying(255) COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default" NOT NULL,
    log_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT logs_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.logs
    OWNER to app_ut_2_log_user;