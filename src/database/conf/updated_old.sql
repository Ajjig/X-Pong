--
-- PostgreSQL database dump
--

-- Dumped from database version 15.3 (Debian 15.3-1.pgdg120+1)
-- Dumped by pg_dump version 15.3 (Debian 15.3-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Achievements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Achievements" (
    id integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    "iconUrl" text NOT NULL,
    "userId" integer NOT NULL
);


ALTER TABLE public."Achievements" OWNER TO postgres;

--
-- Name: Achievements_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Achievements_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Achievements_id_seq" OWNER TO postgres;

--
-- Name: Achievements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Achievements_id_seq" OWNED BY public."Achievements".id;


--
-- Name: Channel; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Channel" (
    id integer NOT NULL,
    name text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    type text,
    password text,
    salt text,
    "ownerId" integer NOT NULL,
    "adminsIds" integer[]
);


ALTER TABLE public."Channel" OWNER TO postgres;

--
-- Name: Channel_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Channel_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Channel_id_seq" OWNER TO postgres;

--
-- Name: Channel_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Channel_id_seq" OWNED BY public."Channel".id;


--
-- Name: DirectMessage; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."DirectMessage" (
    id integer NOT NULL,
    text text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "senderId" integer NOT NULL,
    "receiverId" integer NOT NULL,
    "privateChannelId" text NOT NULL
);


ALTER TABLE public."DirectMessage" OWNER TO postgres;

--
-- Name: DirectMessage_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."DirectMessage_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."DirectMessage_id_seq" OWNER TO postgres;

--
-- Name: DirectMessage_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."DirectMessage_id_seq" OWNED BY public."DirectMessage".id;


--
-- Name: Friends; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Friends" (
    id integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "FriendID" integer NOT NULL,
    "friendshipStatus" text DEFAULT 'Pending'::text NOT NULL,
    "requestSentByID" integer NOT NULL,
    "requestSentToID" integer NOT NULL,
    "userId" integer NOT NULL,
    "friendId" integer NOT NULL
);


ALTER TABLE public."Friends" OWNER TO postgres;

--
-- Name: Friends_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Friends_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Friends_id_seq" OWNER TO postgres;

--
-- Name: Friends_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Friends_id_seq" OWNED BY public."Friends".id;


--
-- Name: Matchs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Matchs" (
    id integer NOT NULL,
    result text DEFAULT 'Undefined'::text NOT NULL,
    "playerScore" integer DEFAULT 0 NOT NULL,
    "opponentScore" integer DEFAULT 0 NOT NULL,
    mode text DEFAULT 'Undefined'::text NOT NULL,
    "opponenId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "userId" integer NOT NULL
);


ALTER TABLE public."Matchs" OWNER TO postgres;

--
-- Name: Matchs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Matchs_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Matchs_id_seq" OWNER TO postgres;

--
-- Name: Matchs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Matchs_id_seq" OWNED BY public."Matchs".id;


--
-- Name: Message; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Message" (
    id integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    content text NOT NULL,
    "channelId" integer NOT NULL,
    "senderId" integer NOT NULL
);


ALTER TABLE public."Message" OWNER TO postgres;

--
-- Name: Message_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Message_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Message_id_seq" OWNER TO postgres;

--
-- Name: Message_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Message_id_seq" OWNED BY public."Message".id;


--
-- Name: Notification; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Notification" (
    id integer NOT NULL,
    type text NOT NULL,
    "from" text NOT NULL,
    "to" text NOT NULL,
    status text NOT NULL,
    msg text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "userId" integer NOT NULL,
    "avatarUrl" text DEFAULT 'https://w7.pngwing.com/pngs/494/808/png-transparent-internet-bot-digital-marketing-telegram-chatbots-computer-network-text-smiley.png'::text NOT NULL,
    "friendId" integer NOT NULL
);


ALTER TABLE public."Notification" OWNER TO postgres;

--
-- Name: Notification_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Notification_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Notification_id_seq" OWNER TO postgres;

--
-- Name: Notification_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Notification_id_seq" OWNED BY public."Notification".id;


--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id integer NOT NULL,
    email text NOT NULL,
    name text NOT NULL,
    username text NOT NULL,
    "avatarUrl" text,
    "oauthId" text,
    "istwoFactor" boolean DEFAULT false NOT NULL,
    "twoFactorAuthSecret" text,
    "onlineStatus" text DEFAULT 'Offline'::text NOT NULL,
    "blockedIds" integer[] DEFAULT ARRAY[]::integer[],
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    confirmed boolean DEFAULT false NOT NULL,
    "onlineAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,
    "isBanned" boolean DEFAULT false NOT NULL,
    "socketId" text,
    "privateChannels" text[]
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."User_id_seq" OWNER TO postgres;

--
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


--
-- Name: Userstats; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Userstats" (
    id integer NOT NULL,
    wins integer DEFAULT 0 NOT NULL,
    losses integer DEFAULT 0 NOT NULL,
    ladder text DEFAULT 'Novice'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "userId" integer NOT NULL
);


ALTER TABLE public."Userstats" OWNER TO postgres;

--
-- Name: Userstats_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Userstats_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Userstats_id_seq" OWNER TO postgres;

--
-- Name: Userstats_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Userstats_id_seq" OWNED BY public."Userstats".id;


--
-- Name: _Admin; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_Admin" (
    "A" integer NOT NULL,
    "B" integer NOT NULL
);


ALTER TABLE public."_Admin" OWNER TO postgres;

--
-- Name: _Banned; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_Banned" (
    "A" integer NOT NULL,
    "B" integer NOT NULL
);


ALTER TABLE public."_Banned" OWNER TO postgres;

--
-- Name: _Invited; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_Invited" (
    "A" integer NOT NULL,
    "B" integer NOT NULL
);


ALTER TABLE public."_Invited" OWNER TO postgres;

--
-- Name: _Kicked; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_Kicked" (
    "A" integer NOT NULL,
    "B" integer NOT NULL
);


ALTER TABLE public."_Kicked" OWNER TO postgres;

--
-- Name: _Member; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_Member" (
    "A" integer NOT NULL,
    "B" integer NOT NULL
);


ALTER TABLE public."_Member" OWNER TO postgres;

--
-- Name: _Muted; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_Muted" (
    "A" integer NOT NULL,
    "B" integer NOT NULL
);


ALTER TABLE public."_Muted" OWNER TO postgres;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: Achievements id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Achievements" ALTER COLUMN id SET DEFAULT nextval('public."Achievements_id_seq"'::regclass);


--
-- Name: Channel id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Channel" ALTER COLUMN id SET DEFAULT nextval('public."Channel_id_seq"'::regclass);


--
-- Name: DirectMessage id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DirectMessage" ALTER COLUMN id SET DEFAULT nextval('public."DirectMessage_id_seq"'::regclass);


--
-- Name: Friends id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Friends" ALTER COLUMN id SET DEFAULT nextval('public."Friends_id_seq"'::regclass);


--
-- Name: Matchs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Matchs" ALTER COLUMN id SET DEFAULT nextval('public."Matchs_id_seq"'::regclass);


--
-- Name: Message id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Message" ALTER COLUMN id SET DEFAULT nextval('public."Message_id_seq"'::regclass);


--
-- Name: Notification id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Notification" ALTER COLUMN id SET DEFAULT nextval('public."Notification_id_seq"'::regclass);


--
-- Name: User id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- Name: Userstats id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Userstats" ALTER COLUMN id SET DEFAULT nextval('public."Userstats_id_seq"'::regclass);


--
-- Data for Name: Achievements; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Achievements" (id, "createdAt", "updatedAt", name, description, "iconUrl", "userId") FROM stdin;
1	2023-08-08 20:58:59.686	2023-08-08 20:58:59.686	Such a hat-trick	Win a 1v1 game with hat-trick difference	/achievements/3goals.jpg	2
2	2023-08-08 20:58:59.771	2023-08-08 20:58:59.771	First Win	Win your first game ever	/achievements/firstwin.jpg	2
\.


--
-- Data for Name: Channel; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Channel" (id, name, "createdAt", "updatedAt", type, password, salt, "ownerId", "adminsIds") FROM stdin;
\.


--
-- Data for Name: DirectMessage; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."DirectMessage" (id, text, "createdAt", "senderId", "receiverId", "privateChannelId") FROM stdin;
1	afeen	2023-08-08 20:57:44.341	2	1	__private__@1+2
2	hania	2023-08-08 20:57:52.494	1	2	__private__@1+2
\.


--
-- Data for Name: Friends; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Friends" (id, "createdAt", "updatedAt", "FriendID", "friendshipStatus", "requestSentByID", "requestSentToID", "userId", "friendId") FROM stdin;
1	2023-08-08 20:38:53.872	2023-08-08 20:39:02.662	1	Accepted	2	1	2	1
2	2023-08-08 20:38:53.879	2023-08-08 20:39:02.662	2	Accepted	2	1	1	2
\.


--
-- Data for Name: Matchs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Matchs" (id, result, "playerScore", "opponentScore", mode, "opponenId", "createdAt", "updatedAt", "userId") FROM stdin;
1	WIN	5	1	1v1	1	2023-08-08 20:58:59.777	2023-08-08 20:58:59.777	2
2	LOSE	1	5	1v1	2	2023-08-08 20:58:59.783	2023-08-08 20:58:59.783	1
\.


--
-- Data for Name: Message; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Message" (id, "createdAt", "updatedAt", content, "channelId", "senderId") FROM stdin;
\.


--
-- Data for Name: Notification; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Notification" (id, type, "from", "to", status, msg, "createdAt", "updatedAt", "userId", "avatarUrl", "friendId") FROM stdin;
2	AcceptRequest	iidkhebb	roudouch	Accepted	iidkhebb accepted your friend request	2023-08-08 20:39:02.689	2023-08-08 20:39:02.689	2	https://cdn.intra.42.fr/users/1dba852f7f6d3b906887c37351e6987c/iidkhebb.jpg	1
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, email, name, username, "avatarUrl", "oauthId", "istwoFactor", "twoFactorAuthSecret", "onlineStatus", "blockedIds", "createdAt", "updatedAt", confirmed, "onlineAt", "isBanned", "socketId", "privateChannels") FROM stdin;
1	iidkhebb@student.1337.ma	Ilyasse Idkhebbach	iidkhebb	https://cdn.intra.42.fr/users/1dba852f7f6d3b906887c37351e6987c/iidkhebb.jpg	\N	f	\N	online	{}	2023-08-08 20:37:33.887	2023-08-08 20:57:17.629	f	2023-08-08 20:37:33.887	f	DQVk9mfnZwT7-6YzAAAH	{__private__@1+2}
2	roudouch@student.1337.ma	Rachid Oudouch	roudouch	https://cdn.intra.42.fr/users/15beaf14c3ddf394270275669e105d65/roudouch.jpg	\N	f	\N	online	{}	2023-08-08 20:37:43.986	2023-08-08 20:57:27.78	f	2023-08-08 20:37:43.986	f	UrHVfBm_nvHTqCCLAAAK	{__private__@1+2}
\.


--
-- Data for Name: Userstats; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Userstats" (id, wins, losses, ladder, "createdAt", "updatedAt", "userId") FROM stdin;
2	1	0	bronze	2023-08-08 20:37:43.986	2023-08-08 20:58:59.81	2
1	0	1	bronze	2023-08-08 20:37:33.887	2023-08-08 20:58:59.812	1
\.


--
-- Data for Name: _Admin; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_Admin" ("A", "B") FROM stdin;
\.


--
-- Data for Name: _Banned; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_Banned" ("A", "B") FROM stdin;
\.


--
-- Data for Name: _Invited; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_Invited" ("A", "B") FROM stdin;
\.


--
-- Data for Name: _Kicked; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_Kicked" ("A", "B") FROM stdin;
\.


--
-- Data for Name: _Member; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_Member" ("A", "B") FROM stdin;
\.


--
-- Data for Name: _Muted; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_Muted" ("A", "B") FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
9aeaeaeb-a5a3-49e2-b729-b5928b185c8d	bc13a70ba7b38338ba8ab5e156b00a6095fe10bbed9155756bc5e844df011777	2023-08-08 20:36:36.134209+00	20230808182724_j	\N	\N	2023-08-08 20:36:36.027205+00	1
\.


--
-- Name: Achievements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Achievements_id_seq"', 2, true);


--
-- Name: Channel_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Channel_id_seq"', 1, false);


--
-- Name: DirectMessage_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."DirectMessage_id_seq"', 2, true);


--
-- Name: Friends_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Friends_id_seq"', 2, true);


--
-- Name: Matchs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Matchs_id_seq"', 2, true);


--
-- Name: Message_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Message_id_seq"', 1, false);


--
-- Name: Notification_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Notification_id_seq"', 2, true);


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."User_id_seq"', 2, true);


--
-- Name: Userstats_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Userstats_id_seq"', 2, true);


--
-- Name: Achievements Achievements_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Achievements"
    ADD CONSTRAINT "Achievements_pkey" PRIMARY KEY (id);


--
-- Name: Channel Channel_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Channel"
    ADD CONSTRAINT "Channel_pkey" PRIMARY KEY (id);


--
-- Name: DirectMessage DirectMessage_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DirectMessage"
    ADD CONSTRAINT "DirectMessage_pkey" PRIMARY KEY (id);


--
-- Name: Friends Friends_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Friends"
    ADD CONSTRAINT "Friends_pkey" PRIMARY KEY (id);


--
-- Name: Matchs Matchs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Matchs"
    ADD CONSTRAINT "Matchs_pkey" PRIMARY KEY (id);


--
-- Name: Message Message_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_pkey" PRIMARY KEY (id);


--
-- Name: Notification Notification_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: Userstats Userstats_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Userstats"
    ADD CONSTRAINT "Userstats_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_oauthId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_oauthId_key" ON public."User" USING btree ("oauthId");


--
-- Name: User_twoFactorAuthSecret_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_twoFactorAuthSecret_key" ON public."User" USING btree ("twoFactorAuthSecret");


--
-- Name: User_username_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_username_key" ON public."User" USING btree (username);


--
-- Name: Userstats_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Userstats_userId_key" ON public."Userstats" USING btree ("userId");


--
-- Name: _Admin_AB_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "_Admin_AB_unique" ON public."_Admin" USING btree ("A", "B");


--
-- Name: _Admin_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_Admin_B_index" ON public."_Admin" USING btree ("B");


--
-- Name: _Banned_AB_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "_Banned_AB_unique" ON public."_Banned" USING btree ("A", "B");


--
-- Name: _Banned_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_Banned_B_index" ON public."_Banned" USING btree ("B");


--
-- Name: _Invited_AB_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "_Invited_AB_unique" ON public."_Invited" USING btree ("A", "B");


--
-- Name: _Invited_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_Invited_B_index" ON public."_Invited" USING btree ("B");


--
-- Name: _Kicked_AB_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "_Kicked_AB_unique" ON public."_Kicked" USING btree ("A", "B");


--
-- Name: _Kicked_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_Kicked_B_index" ON public."_Kicked" USING btree ("B");


--
-- Name: _Member_AB_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "_Member_AB_unique" ON public."_Member" USING btree ("A", "B");


--
-- Name: _Member_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_Member_B_index" ON public."_Member" USING btree ("B");


--
-- Name: _Muted_AB_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "_Muted_AB_unique" ON public."_Muted" USING btree ("A", "B");


--
-- Name: _Muted_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_Muted_B_index" ON public."_Muted" USING btree ("B");


--
-- Name: Achievements Achievements_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Achievements"
    ADD CONSTRAINT "Achievements_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Userstats"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: DirectMessage DirectMessage_receiverId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DirectMessage"
    ADD CONSTRAINT "DirectMessage_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: DirectMessage DirectMessage_senderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DirectMessage"
    ADD CONSTRAINT "DirectMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Friends Friends_friendId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Friends"
    ADD CONSTRAINT "Friends_friendId_fkey" FOREIGN KEY ("friendId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Friends Friends_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Friends"
    ADD CONSTRAINT "Friends_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Matchs Matchs_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Matchs"
    ADD CONSTRAINT "Matchs_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Message Message_channelId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES public."Channel"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Message Message_senderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Notification Notification_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Userstats Userstats_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Userstats"
    ADD CONSTRAINT "Userstats_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: _Admin _Admin_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_Admin"
    ADD CONSTRAINT "_Admin_A_fkey" FOREIGN KEY ("A") REFERENCES public."Channel"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _Admin _Admin_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_Admin"
    ADD CONSTRAINT "_Admin_B_fkey" FOREIGN KEY ("B") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _Banned _Banned_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_Banned"
    ADD CONSTRAINT "_Banned_A_fkey" FOREIGN KEY ("A") REFERENCES public."Channel"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _Banned _Banned_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_Banned"
    ADD CONSTRAINT "_Banned_B_fkey" FOREIGN KEY ("B") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _Invited _Invited_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_Invited"
    ADD CONSTRAINT "_Invited_A_fkey" FOREIGN KEY ("A") REFERENCES public."Channel"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _Invited _Invited_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_Invited"
    ADD CONSTRAINT "_Invited_B_fkey" FOREIGN KEY ("B") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _Kicked _Kicked_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_Kicked"
    ADD CONSTRAINT "_Kicked_A_fkey" FOREIGN KEY ("A") REFERENCES public."Channel"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _Kicked _Kicked_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_Kicked"
    ADD CONSTRAINT "_Kicked_B_fkey" FOREIGN KEY ("B") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _Member _Member_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_Member"
    ADD CONSTRAINT "_Member_A_fkey" FOREIGN KEY ("A") REFERENCES public."Channel"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _Member _Member_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_Member"
    ADD CONSTRAINT "_Member_B_fkey" FOREIGN KEY ("B") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _Muted _Muted_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_Muted"
    ADD CONSTRAINT "_Muted_A_fkey" FOREIGN KEY ("A") REFERENCES public."Channel"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _Muted _Muted_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_Muted"
    ADD CONSTRAINT "_Muted_B_fkey" FOREIGN KEY ("B") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

