
-- DROP TABLE IF EXISTS public."Users";

CREATE TABLE IF NOT EXISTS public."Users"
(
    id bigint unsigned NOT NULL,
    username character(102) COLLATE pg_catalog."default",
    discriminator smallint NOT NULL,
    avatar character(255) COLLATE pg_catalog."default",
    verified boolean,
    email character(255) COLLATE pg_catalog."default",
    flags smallint COLLATE pg_catalog."default",
    accent_color int COLLATE pg_catalog."default",
    premium_type smallint COLLATE pg_catalog."default",
    public_flags smallint COLLATE pg_catalog."default",

    last_update timestamp with time zone,
    CONSTRAINT "Users_pkey" PRIMARY KEY (id),
    CONSTRAINT snowflake_check CHECK (
        id::numeric >= 0::numeric AND
        id::numeric <= '9223372036854775808'::numeric
    ) NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."Users"
    OWNER to current_user;

COMMENT ON CONSTRAINT snowflake_check ON public."Users"
    IS 'snowflake value should be greater than or equal to 0 AND should be less than or equal to 9223372036854775807.';

