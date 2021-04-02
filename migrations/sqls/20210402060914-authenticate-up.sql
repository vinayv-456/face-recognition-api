/* Replace with your SQL commands */
CREATE TABLE public.authenticate
(
    user_id integer NOT NULL,
    password character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT authenticate_pkey PRIMARY KEY (user_id),
    CONSTRAINT fk_user_id FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE public.authenticate
    OWNER to postgres;