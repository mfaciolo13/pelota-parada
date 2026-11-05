-- Renombra la tabla de la migracion inicial al ingles, sin perder su RLS.
ALTER TABLE "torneos" RENAME TO "tournaments";
ALTER TABLE "tournaments" RENAME COLUMN "nombre" TO "name";
ALTER TABLE "tournaments" RENAME COLUMN "creado_en" TO "created_at";
ALTER TABLE "tournaments" RENAME CONSTRAINT "torneos_pkey" TO "tournaments_pkey";

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('PLAYER', 'ORGANIZER', 'REFEREE', 'ADMIN');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "JoinRequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "TournamentFormat" AS ENUM ('F5', 'F7');

-- CreateEnum
CREATE TYPE "TournamentStatus" AS ENUM ('REGISTRATION', 'IN_PROGRESS', 'FINISHED');

-- CreateEnum
CREATE TYPE "RefereeFeePayer" AS ENUM ('ORGANIZER', 'TEAMS');

-- CreateEnum
CREATE TYPE "RegistrationStatus" AS ENUM ('ACTIVE', 'REMOVED');

-- CreateEnum
CREATE TYPE "MatchStatus" AS ENUM ('PENDING', 'PLAYED', 'WALKOVER', 'CANCELLED');

-- CreateEnum
CREATE TYPE "MatchEventType" AS ENUM ('GOAL', 'YELLOW_CARD', 'RED_CARD');

-- CreateEnum
CREATE TYPE "ChargeType" AS ENUM ('FEE', 'FINE');

-- CreateEnum
CREATE TYPE "ChargeStatus" AS ENUM ('PENDING', 'OVERDUE', 'PAID');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'TRANSFER');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('REPORTED', 'CONFIRMED', 'REJECTED');

-- CreateEnum
CREATE TYPE "SponsorTier" AS ENUM ('MAIN', 'OFFICIAL');

-- CreateEnum
CREATE TYPE "SponsorStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ReviewType" AS ENUM ('TOURNAMENT', 'PLAYER', 'REFEREE');

-- CreateEnum
CREATE TYPE "PushPlatform" AS ENUM ('ANDROID', 'IOS', 'WEB');

-- AlterTable
ALTER TABLE "tournaments" ADD COLUMN     "description" TEXT,
ADD COLUMN     "format" "TournamentFormat" NOT NULL,
ADD COLUMN     "legs" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "matchday_fee" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "matchday_fine" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "max_teams" INTEGER,
ADD COLUMN     "organizer_id" UUID NOT NULL,
ADD COLUMN     "points_draw" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "points_win" INTEGER NOT NULL DEFAULT 3,
ADD COLUMN     "referee_fee" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "referee_fee_payer" "RefereeFeePayer" NOT NULL,
ADD COLUMN     "region_id" UUID NOT NULL,
ADD COLUMN     "removal_reason" TEXT,
ADD COLUMN     "removed_at" TIMESTAMPTZ(3),
ADD COLUMN     "removed_by_id" UUID,
ADD COLUMN     "start_date" DATE NOT NULL,
ADD COLUMN     "status" "TournamentStatus" NOT NULL DEFAULT 'REGISTRATION',
ADD COLUMN     "updated_at" TIMESTAMPTZ(3) NOT NULL,
ADD COLUMN     "walkover_goals" INTEGER NOT NULL DEFAULT 3,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(3);

-- CreateTable
CREATE TABLE "regions" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "regions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "avatar_path" TEXT,
    "role" "UserRole",
    "region_id" UUID,
    "policies_accepted_at" TIMESTAMPTZ(3),
    "policies_version" TEXT,
    "identity_verified_at" TIMESTAMPTZ(3),
    "removed_at" TIMESTAMPTZ(3),
    "removal_reason" TEXT,
    "removed_by_id" UUID,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organizer_requests" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "region_id" UUID NOT NULL,
    "description" TEXT NOT NULL,
    "photos" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "reviewed_by_id" UUID,
    "reviewed_at" TIMESTAMPTZ(3),
    "rejection_reason" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "organizer_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teams" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "region_id" UUID NOT NULL,
    "captain_id" UUID NOT NULL,
    "invite_code" TEXT NOT NULL,
    "crest_path" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_members" (
    "id" UUID NOT NULL,
    "team_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "joined_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "left_at" TIMESTAMPTZ(3),

    CONSTRAINT "team_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "join_requests" (
    "id" UUID NOT NULL,
    "team_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "message" TEXT,
    "status" "JoinRequestStatus" NOT NULL DEFAULT 'PENDING',
    "responded_by_id" UUID,
    "responded_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "join_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "matchdays" (
    "id" UUID NOT NULL,
    "tournament_id" UUID NOT NULL,
    "number" INTEGER NOT NULL,
    "week_start" DATE NOT NULL,

    CONSTRAINT "matchdays_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registrations" (
    "id" UUID NOT NULL,
    "tournament_id" UUID NOT NULL,
    "team_id" UUID NOT NULL,
    "status" "RegistrationStatus" NOT NULL DEFAULT 'ACTIVE',
    "removed_at" TIMESTAMPTZ(3),
    "removal_reason" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "registrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registered_players" (
    "id" UUID NOT NULL,
    "registration_id" UUID NOT NULL,
    "tournament_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "registered_players_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tournament_referees" (
    "tournament_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tournament_referees_pkey" PRIMARY KEY ("tournament_id","user_id")
);

-- CreateTable
CREATE TABLE "referee_invitations" (
    "id" UUID NOT NULL,
    "tournament_id" UUID NOT NULL,
    "token" TEXT NOT NULL,
    "created_by_id" UUID NOT NULL,
    "expires_at" TIMESTAMPTZ(3),
    "accepted_by_id" UUID,
    "accepted_at" TIMESTAMPTZ(3),
    "revoked_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "referee_invitations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "matches" (
    "id" UUID NOT NULL,
    "tournament_id" UUID NOT NULL,
    "matchday_id" UUID NOT NULL,
    "home_id" UUID NOT NULL,
    "away_id" UUID NOT NULL,
    "scheduled_at" TIMESTAMPTZ(3),
    "referee_id" UUID,
    "status" "MatchStatus" NOT NULL DEFAULT 'PENDING',
    "home_goals" INTEGER,
    "away_goals" INTEGER,
    "walkover_winner_id" UUID,
    "result_entered_by_id" UUID,
    "result_entered_at" TIMESTAMPTZ(3),
    "result_corrected_by_id" UUID,
    "result_corrected_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "match_events" (
    "id" UUID NOT NULL,
    "match_id" UUID NOT NULL,
    "registration_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "type" "MatchEventType" NOT NULL,
    "minute" INTEGER,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "match_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "charges" (
    "id" UUID NOT NULL,
    "registration_id" UUID NOT NULL,
    "matchday_id" UUID NOT NULL,
    "type" "ChargeType" NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "status" "ChargeStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "charges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" UUID NOT NULL,
    "registration_id" UUID NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "method" "PaymentMethod" NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'REPORTED',
    "receipt_path" TEXT,
    "reported_by_id" UUID NOT NULL,
    "reported_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved_by_id" UUID,
    "resolved_at" TIMESTAMPTZ(3),
    "rejection_reason" TEXT,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_charges" (
    "payment_id" UUID NOT NULL,
    "charge_id" UUID NOT NULL,

    CONSTRAINT "payment_charges_pkey" PRIMARY KEY ("payment_id","charge_id")
);

-- CreateTable
CREATE TABLE "sponsors" (
    "id" UUID NOT NULL,
    "tournament_id" UUID NOT NULL,
    "proposer_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "logo_path" TEXT,
    "link_url" TEXT,
    "tier" "SponsorTier" NOT NULL,
    "status" "SponsorStatus" NOT NULL DEFAULT 'PENDING',
    "reviewed_by_id" UUID,
    "reviewed_at" TIMESTAMPTZ(3),
    "removed_at" TIMESTAMPTZ(3),
    "removal_reason" TEXT,
    "removed_by_id" UUID,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sponsors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" UUID NOT NULL,
    "type" "ReviewType" NOT NULL,
    "author_id" UUID NOT NULL,
    "tournament_id" UUID NOT NULL,
    "target_id" UUID,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "push_devices" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "token" TEXT NOT NULL,
    "platform" "PushPlatform" NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "push_devices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "data" JSONB,
    "read_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "regions_name_key" ON "regions"("name");

-- CreateIndex
CREATE INDEX "users_region_id_idx" ON "users"("region_id");

-- CreateIndex
CREATE INDEX "organizer_requests_user_id_idx" ON "organizer_requests"("user_id");

-- CreateIndex
CREATE INDEX "organizer_requests_status_idx" ON "organizer_requests"("status");

-- CreateIndex
CREATE UNIQUE INDEX "teams_invite_code_key" ON "teams"("invite_code");

-- CreateIndex
CREATE INDEX "teams_region_id_idx" ON "teams"("region_id");

-- CreateIndex
CREATE INDEX "teams_captain_id_idx" ON "teams"("captain_id");

-- CreateIndex
CREATE INDEX "team_members_team_id_idx" ON "team_members"("team_id");

-- CreateIndex
CREATE INDEX "team_members_user_id_idx" ON "team_members"("user_id");

-- CreateIndex
CREATE INDEX "join_requests_team_id_status_idx" ON "join_requests"("team_id", "status");

-- CreateIndex
CREATE INDEX "join_requests_user_id_idx" ON "join_requests"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "matchdays_tournament_id_number_key" ON "matchdays"("tournament_id", "number");

-- CreateIndex
CREATE UNIQUE INDEX "matchdays_id_tournament_id_key" ON "matchdays"("id", "tournament_id");

-- CreateIndex
CREATE INDEX "registrations_team_id_idx" ON "registrations"("team_id");

-- CreateIndex
CREATE UNIQUE INDEX "registrations_tournament_id_team_id_key" ON "registrations"("tournament_id", "team_id");

-- CreateIndex
CREATE UNIQUE INDEX "registrations_id_tournament_id_key" ON "registrations"("id", "tournament_id");

-- CreateIndex
CREATE INDEX "registered_players_user_id_idx" ON "registered_players"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "registered_players_tournament_id_user_id_key" ON "registered_players"("tournament_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "registered_players_registration_id_user_id_key" ON "registered_players"("registration_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "referee_invitations_token_key" ON "referee_invitations"("token");

-- CreateIndex
CREATE INDEX "referee_invitations_tournament_id_idx" ON "referee_invitations"("tournament_id");

-- CreateIndex
CREATE INDEX "matches_tournament_id_status_idx" ON "matches"("tournament_id", "status");

-- CreateIndex
CREATE INDEX "matches_matchday_id_idx" ON "matches"("matchday_id");

-- CreateIndex
CREATE INDEX "matches_referee_id_idx" ON "matches"("referee_id");

-- CreateIndex
CREATE INDEX "match_events_match_id_idx" ON "match_events"("match_id");

-- CreateIndex
CREATE INDEX "match_events_user_id_type_idx" ON "match_events"("user_id", "type");

-- CreateIndex
CREATE INDEX "charges_registration_id_status_idx" ON "charges"("registration_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "charges_registration_id_matchday_id_type_key" ON "charges"("registration_id", "matchday_id", "type");

-- CreateIndex
CREATE INDEX "payments_registration_id_status_idx" ON "payments"("registration_id", "status");

-- CreateIndex
CREATE INDEX "payment_charges_charge_id_idx" ON "payment_charges"("charge_id");

-- CreateIndex
CREATE INDEX "sponsors_tournament_id_status_idx" ON "sponsors"("tournament_id", "status");

-- CreateIndex
CREATE INDEX "reviews_tournament_id_type_idx" ON "reviews"("tournament_id", "type");

-- CreateIndex
CREATE INDEX "reviews_target_id_type_idx" ON "reviews"("target_id", "type");

-- CreateIndex
CREATE UNIQUE INDEX "push_devices_token_key" ON "push_devices"("token");

-- CreateIndex
CREATE INDEX "push_devices_user_id_idx" ON "push_devices"("user_id");

-- CreateIndex
CREATE INDEX "notifications_user_id_created_at_idx" ON "notifications"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "tournaments_region_id_status_idx" ON "tournaments"("region_id", "status");

-- CreateIndex
CREATE INDEX "tournaments_organizer_id_idx" ON "tournaments"("organizer_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "regions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_removed_by_id_fkey" FOREIGN KEY ("removed_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizer_requests" ADD CONSTRAINT "organizer_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizer_requests" ADD CONSTRAINT "organizer_requests_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "regions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizer_requests" ADD CONSTRAINT "organizer_requests_reviewed_by_id_fkey" FOREIGN KEY ("reviewed_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "regions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_captain_id_fkey" FOREIGN KEY ("captain_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "join_requests" ADD CONSTRAINT "join_requests_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "join_requests" ADD CONSTRAINT "join_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "join_requests" ADD CONSTRAINT "join_requests_responded_by_id_fkey" FOREIGN KEY ("responded_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tournaments" ADD CONSTRAINT "tournaments_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "regions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tournaments" ADD CONSTRAINT "tournaments_organizer_id_fkey" FOREIGN KEY ("organizer_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tournaments" ADD CONSTRAINT "tournaments_removed_by_id_fkey" FOREIGN KEY ("removed_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matchdays" ADD CONSTRAINT "matchdays_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "tournaments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registrations" ADD CONSTRAINT "registrations_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "tournaments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registrations" ADD CONSTRAINT "registrations_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registered_players" ADD CONSTRAINT "registered_players_registration_id_tournament_id_fkey" FOREIGN KEY ("registration_id", "tournament_id") REFERENCES "registrations"("id", "tournament_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registered_players" ADD CONSTRAINT "registered_players_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "tournaments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registered_players" ADD CONSTRAINT "registered_players_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tournament_referees" ADD CONSTRAINT "tournament_referees_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "tournaments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tournament_referees" ADD CONSTRAINT "tournament_referees_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referee_invitations" ADD CONSTRAINT "referee_invitations_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "tournaments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referee_invitations" ADD CONSTRAINT "referee_invitations_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referee_invitations" ADD CONSTRAINT "referee_invitations_accepted_by_id_fkey" FOREIGN KEY ("accepted_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "tournaments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_matchday_id_tournament_id_fkey" FOREIGN KEY ("matchday_id", "tournament_id") REFERENCES "matchdays"("id", "tournament_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_home_id_tournament_id_fkey" FOREIGN KEY ("home_id", "tournament_id") REFERENCES "registrations"("id", "tournament_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_away_id_tournament_id_fkey" FOREIGN KEY ("away_id", "tournament_id") REFERENCES "registrations"("id", "tournament_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_walkover_winner_id_fkey" FOREIGN KEY ("walkover_winner_id") REFERENCES "registrations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_referee_id_fkey" FOREIGN KEY ("referee_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_result_entered_by_id_fkey" FOREIGN KEY ("result_entered_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_result_corrected_by_id_fkey" FOREIGN KEY ("result_corrected_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_events" ADD CONSTRAINT "match_events_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_events" ADD CONSTRAINT "match_events_registration_id_user_id_fkey" FOREIGN KEY ("registration_id", "user_id") REFERENCES "registered_players"("registration_id", "user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_events" ADD CONSTRAINT "match_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "charges" ADD CONSTRAINT "charges_registration_id_fkey" FOREIGN KEY ("registration_id") REFERENCES "registrations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "charges" ADD CONSTRAINT "charges_matchday_id_fkey" FOREIGN KEY ("matchday_id") REFERENCES "matchdays"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_registration_id_fkey" FOREIGN KEY ("registration_id") REFERENCES "registrations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_reported_by_id_fkey" FOREIGN KEY ("reported_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_resolved_by_id_fkey" FOREIGN KEY ("resolved_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_charges" ADD CONSTRAINT "payment_charges_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_charges" ADD CONSTRAINT "payment_charges_charge_id_fkey" FOREIGN KEY ("charge_id") REFERENCES "charges"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sponsors" ADD CONSTRAINT "sponsors_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "tournaments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sponsors" ADD CONSTRAINT "sponsors_proposer_id_fkey" FOREIGN KEY ("proposer_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sponsors" ADD CONSTRAINT "sponsors_reviewed_by_id_fkey" FOREIGN KEY ("reviewed_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sponsors" ADD CONSTRAINT "sponsors_removed_by_id_fkey" FOREIGN KEY ("removed_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "tournaments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_target_id_fkey" FOREIGN KEY ("target_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "push_devices" ADD CONSTRAINT "push_devices_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Reglas que Prisma no expresa: indices unicos parciales y restricciones CHECK.

-- Una solicitud de organizador pendiente por usuario.
CREATE UNIQUE INDEX "organizer_requests_pending_user_key" ON "organizer_requests"("user_id") WHERE "status" = 'PENDING';

-- Un jugador figura una sola vez en el plantel vigente de un equipo. "left_at" conserva el historial.
CREATE UNIQUE INDEX "team_members_current_key" ON "team_members"("team_id", "user_id") WHERE "left_at" IS NULL;

-- Una postulacion pendiente por jugador y equipo.
CREATE UNIQUE INDEX "join_requests_pending_key" ON "join_requests"("team_id", "user_id") WHERE "status" = 'PENDING';

-- Un solo sponsor principal vigente por torneo.
CREATE UNIQUE INDEX "sponsors_current_main_key" ON "sponsors"("tournament_id") WHERE "tier" = 'MAIN' AND "status" = 'APPROVED' AND "removed_at" IS NULL;

-- Una review por torneo y autor, y una por jugador o arbitro, autor y torneo.
CREATE UNIQUE INDEX "reviews_tournament_author_key" ON "reviews"("author_id", "tournament_id") WHERE "type" = 'TOURNAMENT';
CREATE UNIQUE INDEX "reviews_person_author_key" ON "reviews"("author_id", "tournament_id", "target_id", "type") WHERE "type" <> 'TOURNAMENT';

ALTER TABLE "tournaments"
    ADD CONSTRAINT "tournaments_legs_check" CHECK ("legs" IN (1, 2)),
    ADD CONSTRAINT "tournaments_start_date_monday_check" CHECK (EXTRACT(ISODOW FROM "start_date") = 1),
    ADD CONSTRAINT "tournaments_max_teams_check" CHECK ("max_teams" IS NULL OR "max_teams" >= 2),
    ADD CONSTRAINT "tournaments_amounts_check" CHECK ("matchday_fee" >= 0 AND "matchday_fine" >= 0 AND "referee_fee" >= 0),
    ADD CONSTRAINT "tournaments_rules_check" CHECK ("points_win" >= 0 AND "points_draw" >= 0 AND "walkover_goals" >= 0);

ALTER TABLE "matchdays"
    ADD CONSTRAINT "matchdays_number_check" CHECK ("number" >= 1),
    ADD CONSTRAINT "matchdays_week_start_monday_check" CHECK (EXTRACT(ISODOW FROM "week_start") = 1);

ALTER TABLE "matches"
    ADD CONSTRAINT "matches_distinct_teams_check" CHECK ("home_id" <> "away_id"),
    ADD CONSTRAINT "matches_goals_check" CHECK (("home_goals" IS NULL OR "home_goals" >= 0) AND ("away_goals" IS NULL OR "away_goals" >= 0)),
    ADD CONSTRAINT "matches_played_has_goals_check" CHECK ("status" <> 'PLAYED' OR ("home_goals" IS NOT NULL AND "away_goals" IS NOT NULL)),
    ADD CONSTRAINT "matches_walkover_winner_check" CHECK ("walkover_winner_id" IS NULL OR ("status" = 'WALKOVER' AND "walkover_winner_id" IN ("home_id", "away_id")));

ALTER TABLE "match_events"
    ADD CONSTRAINT "match_events_minute_check" CHECK ("minute" IS NULL OR "minute" BETWEEN 0 AND 130);

ALTER TABLE "charges"
    ADD CONSTRAINT "charges_amount_check" CHECK ("amount" >= 0);

ALTER TABLE "payments"
    ADD CONSTRAINT "payments_amount_check" CHECK ("amount" > 0);

ALTER TABLE "reviews"
    ADD CONSTRAINT "reviews_rating_check" CHECK ("rating" BETWEEN 1 AND 5),
    ADD CONSTRAINT "reviews_target_check" CHECK (
        ("type" = 'TOURNAMENT' AND "target_id" IS NULL)
        OR ("type" <> 'TOURNAMENT' AND "target_id" IS NOT NULL AND "target_id" <> "author_id")
    );

-- Supabase expone el esquema public por su API con la clave publica.
-- Sin politicas, RLS deja cada tabla inaccesible por esa via; la API accede con Prisma.
ALTER TABLE "regions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "organizer_requests" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "teams" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "team_members" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "join_requests" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "matchdays" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "registrations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "registered_players" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "tournament_referees" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "referee_invitations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "matches" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "match_events" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "charges" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "payments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "payment_charges" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "sponsors" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "reviews" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "push_devices" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "notifications" ENABLE ROW LEVEL SECURITY;
