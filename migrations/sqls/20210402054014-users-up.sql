/* Replace with your SQL commands */

-- Table: public.product

-- DROP TABLE public.product;

CREATE TABLE public.users
(
    id SERIAL,
    name character varying COLLATE pg_catalog."default" NOT NULL,
    email character varying NOT NULL,
    entries integer NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.users
    OWNER to postgres;