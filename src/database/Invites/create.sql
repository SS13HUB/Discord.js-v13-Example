
-- Table: public.Invites

-- DROP TABLE IF EXISTS public."Invites";

CREATE TABLE IF NOT EXISTS public."Invites"
(
    id bigint NOT NULL, -- ToDo: unsigned; CHECK snowflake_check
    code character(102) COLLATE pg_catalog."default",
    guild_id bigint COLLATE pg_catalog."default",
    ---
    channel_id bigint COLLATE pg_catalog."default",
    inviter_id bigint COLLATE pg_catalog."default",
    target_type integer,
    target_user bigint COLLATE pg_catalog."default",
    target_application text COLLATE pg_catalog."default",
    approximate_presence_count integer,
    approximate_member_count integer,
    expires_at timestamp,
    stage_instance text COLLATE pg_catalog."default",
    guild_scheduled_event text COLLATE pg_catalog."default",
    ---
    --- https://youtu.be/vK_n9apIOlM
    discoverer_id bigint COLLATE pg_catalog."default",
    discovery_date timestamp with time zone,
    was_revoked boolean,
    revoker_id bigint COLLATE pg_catalog."default",
    revoke_date timestamp with time zone,
    updater_id bigint COLLATE pg_catalog."default",
    updated timestamp with time zone,
    ---
    CONSTRAINT "Invites_pkey" PRIMARY KEY (id),
    CONSTRAINT id UNIQUE (id),
    CONSTRAINT snowflake_check CHECK (
        id::numeric >= 0::numeric AND
        id::numeric <= '9223372036854775808'::numeric
    ) NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."Invites"
    OWNER to current_user;

COMMENT ON TABLE public."Invites"
    IS 'To write...';

COMMENT ON CONSTRAINT snowflake_check ON public."Invites"
    IS 'Snowflake value should be greater than or equal to 0 AND should be less than or equal to 9223372036854775807.';

