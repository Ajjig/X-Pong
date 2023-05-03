--
-- PostgreSQL database dump
--

-- Dumped from database version 15.2 (Debian 15.2-1.pgdg110+1)
-- Dumped by pg_dump version 15.2 (Debian 15.2-1.pgdg110+1)

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
-- Name: Channel; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Channel" (
    id integer NOT NULL,
    name text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "isPublic" boolean DEFAULT true NOT NULL,
    password text,
    owner text NOT NULL,
    salt text
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
    "privateChannelId" text NOT NULL,
    "ReceiverUsername" text NOT NULL,
    "SenderUsername" text NOT NULL
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
    username text,
    "userId" integer NOT NULL,
    "friendshipStatus" text DEFAULT 'Pending'::text NOT NULL,
    "onlineStatus" text DEFAULT 'Offline'::text NOT NULL,
    ladder text DEFAULT 'Novice'::text NOT NULL
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
    opponent text DEFAULT 'Undefined'::text NOT NULL,
    map text DEFAULT 'Undefined'::text NOT NULL,
    mode text DEFAULT 'Undefined'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "userId" integer NOT NULL,
    "opponentUserId" integer NOT NULL
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
    sender text NOT NULL,
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
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id integer NOT NULL,
    email text NOT NULL,
    name text NOT NULL,
    username text,
    "avatarUrl" text DEFAULT 'https://i.pravatar.cc/150?img=3'::text NOT NULL,
    "oauthId" text,
    "istwoFactor" boolean DEFAULT false NOT NULL,
    "twoFactorAuthSecret" text,
    "onlineStatus" text DEFAULT 'Offline'::text NOT NULL,
    "blockedUsernames" text[],
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    confirmed boolean DEFAULT false NOT NULL,
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
    achievements text[],
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
-- Name: User id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- Name: Userstats id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Userstats" ALTER COLUMN id SET DEFAULT nextval('public."Userstats_id_seq"'::regclass);


--
-- Data for Name: Channel; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Channel" (id, name, "createdAt", "updatedAt", "isPublic", password, owner, salt) FROM stdin;
1	freaks	2023-03-19 15:15:21.688	2023-03-19 15:15:21.688	f	$2b$10$kZaGR6e4ZxcY2ZYZcr1VF.Mm/aQNuvarjacJ.d2c1oZbw0m/jyNiK	iidkhebb	$2b$10$kZaGR6e4ZxcY2ZYZcr1VF.
\.


--
-- Data for Name: DirectMessage; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."DirectMessage" (id, text, "createdAt", "senderId", "receiverId", "privateChannelId", "ReceiverUsername", "SenderUsername") FROM stdin;
1	test	2023-03-19 11:44:41.672	1	2	__private__iidkhebb__test	test	iidkhebb
2	test	2023-03-19 11:45:33.166	1	2	__private__iidkhebb__test	test	iidkhebb
3	test	2023-03-19 11:46:22.775	1	2	__private__iidkhebb__test	test	iidkhebb
4	test	2023-03-19 11:46:38.011	1	2	__private__iidkhebb__test	test	iidkhebb
\.


--
-- Data for Name: Friends; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Friends" (id, "createdAt", "updatedAt", username, "userId", "friendshipStatus", "onlineStatus", ladder) FROM stdin;
\.


--
-- Data for Name: Matchs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Matchs" (id, result, opponent, map, mode, "createdAt", "updatedAt", "userId", "opponentUserId") FROM stdin;
1	Win	test	basic	random	2023-05-03 14:49:45.766	2023-05-03 14:49:45.766	1	2
2	Win	test	basic	random	2023-05-03 14:49:54.988	2023-05-03 14:49:54.988	1	2
3	Win	test	basic	random	2023-05-03 14:49:56.346	2023-05-03 14:49:56.346	1	2
\.


--
-- Data for Name: Message; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Message" (id, "createdAt", "updatedAt", content, "channelId", sender, "senderId") FROM stdin;
1	2023-03-19 16:24:09.952	2023-03-19 16:24:09.952	ok bb	1	test	2
2	2023-03-19 16:24:22.218	2023-03-19 16:24:22.218	aji negolik	1	iidkhebb	1
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, email, name, username, "avatarUrl", "oauthId", "istwoFactor", "twoFactorAuthSecret", "onlineStatus", "blockedUsernames", "createdAt", "updatedAt", confirmed, "privateChannels") FROM stdin;
1	iidkhebb@student.1337.ma	Ilyasse Idkhebbach	iidkhebb	https://i.pravatar.cc/150?img=3	\N	f	\N	Offline	{}	2023-03-19 08:09:13.937	2023-03-19 11:32:53.597	f	{__private__iidkhebb__test}
2	gkmjg	jghkm	test	https://i.pravatar.cc/150?img=3	\N	f	\N	Offline	{}	2023-03-19 11:32:41.694	2023-03-19 11:32:53.606	f	{__private__iidkhebb__test}
\.


--
-- Data for Name: Userstats; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Userstats" (id, achievements, wins, losses, ladder, "createdAt", "updatedAt", "userId") FROM stdin;
1	{}	3	0	bronze	2023-03-19 08:09:13.937	2023-05-03 14:49:56.354	1
\.


--
-- Data for Name: _Admin; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_Admin" ("A", "B") FROM stdin;
1	1
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
1	2
\.


--
-- Data for Name: _Member; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_Member" ("A", "B") FROM stdin;
1	1
1	2
\.


--
-- Data for Name: _Muted; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_Muted" ("A", "B") FROM stdin;
1	2
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
76826cfe-f7c1-4ed8-9dd1-1267b0d730b3	9a959e311c6fc343411e2ecc95c3518028102bce77d7e3bfadcff0b8ff9c5577	2023-03-12 19:58:12.462641+00	20230305190901_	\N	\N	2023-03-12 19:58:12.405836+00	1
0856f7ca-7c32-4f9e-a232-463f2d9d4ae2	ea7339067330b044b2e9caa0ae10902a9a7211519a5153b50e93e45fdadd60c4	2023-03-12 19:58:12.472928+00	20230305191109_init	\N	\N	2023-03-12 19:58:12.467482+00	1
99f944fc-e050-4257-a7c1-a91a6eb34b20	b4cf027d77255b1d8aefa37c7903d8a85a4649c3dadf2779b0d024a608da6451	2023-03-12 19:58:12.481491+00	20230305234205_upgrade_friends	\N	\N	2023-03-12 19:58:12.476411+00	1
b833792e-e879-4911-a5ce-0054eb016002	671971f49a8418ae8c158ca462c76298021a2430f517bac299ddc66d628c09f0	2023-03-12 19:58:12.488778+00	20230305234327_friends	\N	\N	2023-03-12 19:58:12.484789+00	1
d58236e4-094f-4798-806c-55be220bb205	0b36071235c073c24e2e3af130ee82a9f62fff179fa7edbe8755074761de141c	2023-03-12 19:58:12.501233+00	20230306000153_matchs	\N	\N	2023-03-12 19:58:12.491771+00	1
165bf419-82b3-4ded-9cc1-78c48f7971f5	2624b52d3ee27bc524fbcfa685fd5cc5a01109dd64c82f0d8e1a2c29ac01d089	2023-03-12 19:58:12.509851+00	20230306002546_fix	\N	\N	2023-03-12 19:58:12.504779+00	1
adc8e0c7-8d16-4753-b092-aeec77749ef7	617a43d260ce3806027e477162edb3c0edd906243602a12c093bad7c013dcfa1	2023-03-12 19:58:12.518852+00	20230306200241_	\N	\N	2023-03-12 19:58:12.514706+00	1
ba0fd398-b34c-482d-992e-96036b2f3d69	cbaf7920ab2a00e8fb8df8dc845271cac2fff27a82da579aef0ec4338cce4ef6	2023-03-12 19:58:12.532377+00	20230306214927_fix	\N	\N	2023-03-12 19:58:12.521968+00	1
0986d244-cfbf-4f4e-a8f9-19eee7723241	b961a8fe238c457d9d5b5b05728ef979778cabbd5e169988820f37853cf6974a	2023-03-12 19:58:12.539807+00	20230306224645_ban_kick	\N	\N	2023-03-12 19:58:12.535562+00	1
5efa5c28-7875-4308-8fb1-7bccefe0637a	de81f24d3cef6fe8b0261eaf34eec59b6a937dc04ca37996891fd2006cf34185	2023-03-12 19:58:12.54927+00	20230308191814_pass	\N	\N	2023-03-12 19:58:12.5442+00	1
09af3af1-7e16-4405-88a6-6ca4cd0c97b5	79f8a1919ed23a2878c77d92598b322aaeeb830f55372cf5ec8ad8656fd7690e	2023-03-12 19:58:12.566073+00	20230312030244_remove_setting	\N	\N	2023-03-12 19:58:12.552536+00	1
f7959594-4b1f-4dd3-bdeb-b3562ac30608	a1c19b6378fc544500545b97918a1030b301668bb2e79bd7fe09153521d59a26	2023-03-19 08:08:22.222012+00	20230318015447_added_private_channels_messages_id	\N	\N	2023-03-19 08:08:22.217136+00	1
c3f1d5b5-4e9f-4269-86fa-90e1dd5ffca1	cd21a6084507d65ff4481a22e74284af4020e5c33d68e51b4aeed84db4bf5b3d	2023-03-19 08:08:22.231485+00	20230318081904_add_socket_id	\N	\N	2023-03-19 08:08:22.22716+00	1
2c58737a-0b1a-4486-a64c-2fdef6810dd8	7351f536fbecd48425c41afb4650487a71ff3b0b69a2659c7fe6ce7bec871573	2023-03-19 08:08:22.241795+00	20230318085246_add_private	\N	\N	2023-03-19 08:08:22.234463+00	1
69c81084-fa78-4a65-a029-0af5b19384c5	cdc6a9345f5938137f836ba85816d018f59233e83b9c669b3e625449eb9475ce	2023-03-19 08:08:22.249756+00	20230318085441_add_more_directmessage	\N	\N	2023-03-19 08:08:22.245162+00	1
e836674e-5e3a-4f2c-a135-b578e8868e2c	c6c6cd0007c704d5ea02e258efee7595dc07f60ec40f968f212bcc496ded8a81	2023-03-19 08:08:22.258566+00	20230318092400_dd	\N	\N	2023-03-19 08:08:22.252749+00	1
19c61015-1bcc-40bf-abd8-dcb6e7dc884b	2b38877277d21051ac4f28eb9d1ab346a5e67bcde3ef08eff2abc7df53173606	2023-03-19 08:08:22.267069+00	20230318101241_ff	\N	\N	2023-03-19 08:08:22.262627+00	1
ce37542a-2a7e-4fa7-9c45-d09319ca74de	e3321fe83c3ba4e50fb978c41aa8f8034fbe8b4c94428b4b378a2f60bb566dd2	2023-03-19 08:08:26.387248+00	20230319080826_deplot	\N	\N	2023-03-19 08:08:26.383411+00	1
4289f97b-93f4-4462-ae54-6b17085ed6ba	40cb04d536645a6dce9192a879f8cb4710ab8096746ee39dc6b39be80068fc87	2023-03-19 16:18:42.716761+00	20230319161842_	\N	\N	2023-03-19 16:18:42.706559+00	1
ad3ea342-71c2-49fc-a6c4-6b68d09a59ba	96236c3c49ee2db123b95f0b5d3a02f0ac4b90845d52294e2c587ba7c214a845	2023-05-03 14:49:00.745874+00	20230503142457_oppo_matvhs	\N	\N	2023-05-03 14:49:00.741122+00	1
\.


--
-- Name: Channel_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Channel_id_seq"', 1, true);


--
-- Name: DirectMessage_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."DirectMessage_id_seq"', 4, true);


--
-- Name: Friends_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Friends_id_seq"', 1, false);


--
-- Name: Matchs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Matchs_id_seq"', 3, true);


--
-- Name: Message_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Message_id_seq"', 2, true);


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."User_id_seq"', 2, true);


--
-- Name: Userstats_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Userstats_id_seq"', 1, true);


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
-- Name: Channel_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Channel_name_key" ON public."Channel" USING btree (name);


--
-- Name: Friends_username_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Friends_username_key" ON public."Friends" USING btree (username);


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
-- Name: Friends Friends_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Friends"
    ADD CONSTRAINT "Friends_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Matchs Matchs_opponentUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Matchs"
    ADD CONSTRAINT "Matchs_opponentUserId_fkey" FOREIGN KEY ("opponentUserId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


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

