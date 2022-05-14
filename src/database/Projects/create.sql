
-- DROP TABLE IF EXISTS public."Projects";

CREATE TABLE IF NOT EXISTS public."Projects"
(
    id bigint unsigned NOT NULL,
    name character(255) COLLATE pg_catalog."default",
    ---
    name_long character(255) COLLATE pg_catalog."default",
    description text COLLATE pg_catalog."default",
    locale character(255) COLLATE pg_catalog."default",
    guild_id bigint, -- ToDo: guild_ids bigint[]
    discovery_splash character(255) COLLATE pg_catalog."default",
    owner_id bigint, -- ToDo: owner_ids bigint[]
    ---
    last_update timestamp with time zone,
    CONSTRAINT "Projects_pkey" PRIMARY KEY (id),
    CONSTRAINT snowflake_check CHECK (
        id::numeric >= 0::numeric AND
        id::numeric <= '9223372036854775808'::numeric
    ) NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."Projects"
    OWNER to current_user;

COMMENT ON TABLE public."Guilds"
    IS 'To write...';

COMMENT ON CONSTRAINT snowflake_check ON public."Projects"
    IS 'snowflake value should be greater than or equal to 0 AND should be less than or equal to 9223372036854775807.';

