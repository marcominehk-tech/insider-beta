-- CreateEnum
CREATE TYPE "TradeSource" AS ENUM ('SEC_FORM_4', 'CONGRESS', 'THIRD_PARTY_API');

-- CreateEnum
CREATE TYPE "TradeEntityType" AS ENUM ('POLITICIAN', 'INSIDER');

-- CreateEnum
CREATE TYPE "TradeDirection" AS ENUM ('BUY', 'SELL', 'EXERCISE', 'AWARD', 'OTHER');

-- CreateEnum
CREATE TYPE "InstrumentType" AS ENUM ('STOCK', 'OPTION', 'ETF', 'OTHER');

-- CreateEnum
CREATE TYPE "OptionType" AS ENUM ('CALL', 'PUT');

-- CreateEnum
CREATE TYPE "FeedbackStatus" AS ENUM ('NEW', 'REVIEWED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "TestimonialStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'HIDDEN');

-- CreateTable
CREATE TABLE "Politician" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "displayName" TEXT,
    "chamber" TEXT,
    "state" TEXT,
    "party" TEXT,
    "district" TEXT,
    "countryCode" TEXT NOT NULL DEFAULT 'US',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "avatarUrl" TEXT,
    "bio" TEXT,
    "externalRef" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Politician_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Insider" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "title" TEXT,
    "role" TEXT,
    "isDirector" BOOLEAN NOT NULL DEFAULT false,
    "isOfficer" BOOLEAN NOT NULL DEFAULT false,
    "isTenPercentOwner" BOOLEAN NOT NULL DEFAULT false,
    "issuerId" TEXT,
    "externalRef" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Insider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Issuer" (
    "id" TEXT NOT NULL,
    "ticker" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "exchange" TEXT,
    "sector" TEXT,
    "industry" TEXT,
    "countryCode" TEXT NOT NULL DEFAULT 'US',
    "websiteUrl" TEXT,
    "logoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Issuer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Asset" (
    "id" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "name" TEXT,
    "instrumentType" "InstrumentType" NOT NULL,
    "optionType" "OptionType",
    "underlyingSymbol" TEXT,
    "strikePrice" DECIMAL(18,4),
    "expirationDate" TIMESTAMP(3),
    "exchange" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "issuerId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RawFiling" (
    "id" TEXT NOT NULL,
    "source" "TradeSource" NOT NULL,
    "filingId" TEXT NOT NULL,
    "sourceUrl" TEXT,
    "filedAt" TIMESTAMP(3),
    "acceptedAt" TIMESTAMP(3),
    "documentType" TEXT,
    "issuerName" TEXT,
    "issuerTicker" TEXT,
    "reporterName" TEXT,
    "rawJson" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RawFiling_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TradeEvent" (
    "id" TEXT NOT NULL,
    "source" "TradeSource" NOT NULL,
    "entityType" "TradeEntityType" NOT NULL,
    "direction" "TradeDirection" NOT NULL,
    "politicianId" TEXT,
    "insiderId" TEXT,
    "issuerId" TEXT,
    "assetId" TEXT,
    "rawFilingId" TEXT,
    "externalTradeId" TEXT,
    "tradeDate" TIMESTAMP(3) NOT NULL,
    "disclosedDate" TIMESTAMP(3),
    "filedAt" TIMESTAMP(3),
    "quantity" DECIMAL(20,4),
    "price" DECIMAL(18,4),
    "amountMin" DECIMAL(18,2),
    "amountMax" DECIMAL(18,2),
    "estimatedAmount" DECIMAL(18,2),
    "ownershipType" TEXT,
    "postTradeShares" DECIMAL(20,4),
    "transactionCode" TEXT,
    "assetDescription" TEXT,
    "notes" TEXT,
    "isLate" BOOLEAN NOT NULL DEFAULT false,
    "isImportant" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TradeEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HoldingSnapshot" (
    "id" TEXT NOT NULL,
    "entityType" "TradeEntityType" NOT NULL,
    "politicianId" TEXT,
    "insiderId" TEXT,
    "assetId" TEXT NOT NULL,
    "snapshotDate" TIMESTAMP(3) NOT NULL,
    "sharesHeld" DECIMAL(20,4),
    "marketValue" DECIMAL(18,2),
    "sourceNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HoldingSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PerformanceSnapshot" (
    "id" TEXT NOT NULL,
    "politicianId" TEXT NOT NULL,
    "snapshotDate" TIMESTAMP(3) NOT NULL,
    "lookbackDays" INTEGER NOT NULL,
    "avgReturn30d" DECIMAL(8,4),
    "avgReturn60d" DECIMAL(8,4),
    "winRate" DECIMAL(6,4),
    "tradeCount" INTEGER NOT NULL DEFAULT 0,
    "score" DECIMAL(10,4),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PerformanceSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivitySnapshot" (
    "id" TEXT NOT NULL,
    "politicianId" TEXT NOT NULL,
    "snapshotDate" TIMESTAMP(3) NOT NULL,
    "windowDays" INTEGER NOT NULL,
    "tradeCount" INTEGER NOT NULL DEFAULT 0,
    "activityScore" DECIMAL(10,4),
    "buyCount" INTEGER NOT NULL DEFAULT 0,
    "sellCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ActivitySnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Testimonial" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "roleLabel" TEXT,
    "companyLabel" TEXT,
    "locale" TEXT NOT NULL DEFAULT 'zh-Hant',
    "quote" TEXT NOT NULL,
    "status" "TestimonialStatus" NOT NULL DEFAULT 'DRAFT',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeedbackSubmission" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "telegramHandle" TEXT,
    "message" TEXT NOT NULL,
    "locale" TEXT NOT NULL DEFAULT 'zh-Hant',
    "status" "FeedbackStatus" NOT NULL DEFAULT 'NEW',
    "pagePath" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeedbackSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Politician_slug_key" ON "Politician"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Politician_externalRef_key" ON "Politician"("externalRef");

-- CreateIndex
CREATE INDEX "Politician_fullName_idx" ON "Politician"("fullName");

-- CreateIndex
CREATE INDEX "Politician_party_idx" ON "Politician"("party");

-- CreateIndex
CREATE INDEX "Politician_state_idx" ON "Politician"("state");

-- CreateIndex
CREATE INDEX "Politician_isActive_idx" ON "Politician"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "Insider_slug_key" ON "Insider"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Insider_externalRef_key" ON "Insider"("externalRef");

-- CreateIndex
CREATE INDEX "Insider_fullName_idx" ON "Insider"("fullName");

-- CreateIndex
CREATE INDEX "Insider_issuerId_idx" ON "Insider"("issuerId");

-- CreateIndex
CREATE UNIQUE INDEX "Issuer_ticker_key" ON "Issuer"("ticker");

-- CreateIndex
CREATE INDEX "Issuer_name_idx" ON "Issuer"("name");

-- CreateIndex
CREATE INDEX "Issuer_sector_idx" ON "Issuer"("sector");

-- CreateIndex
CREATE UNIQUE INDEX "Asset_symbol_key" ON "Asset"("symbol");

-- CreateIndex
CREATE INDEX "Asset_instrumentType_idx" ON "Asset"("instrumentType");

-- CreateIndex
CREATE INDEX "Asset_underlyingSymbol_idx" ON "Asset"("underlyingSymbol");

-- CreateIndex
CREATE INDEX "Asset_issuerId_idx" ON "Asset"("issuerId");

-- CreateIndex
CREATE INDEX "Asset_isActive_idx" ON "Asset"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "RawFiling_filingId_key" ON "RawFiling"("filingId");

-- CreateIndex
CREATE INDEX "RawFiling_source_filedAt_idx" ON "RawFiling"("source", "filedAt");

-- CreateIndex
CREATE INDEX "RawFiling_issuerTicker_idx" ON "RawFiling"("issuerTicker");

-- CreateIndex
CREATE INDEX "RawFiling_reporterName_idx" ON "RawFiling"("reporterName");

-- CreateIndex
CREATE UNIQUE INDEX "TradeEvent_externalTradeId_key" ON "TradeEvent"("externalTradeId");

-- CreateIndex
CREATE INDEX "TradeEvent_tradeDate_idx" ON "TradeEvent"("tradeDate");

-- CreateIndex
CREATE INDEX "TradeEvent_disclosedDate_idx" ON "TradeEvent"("disclosedDate");

-- CreateIndex
CREATE INDEX "TradeEvent_filedAt_idx" ON "TradeEvent"("filedAt");

-- CreateIndex
CREATE INDEX "TradeEvent_source_tradeDate_idx" ON "TradeEvent"("source", "tradeDate");

-- CreateIndex
CREATE INDEX "TradeEvent_entityType_tradeDate_idx" ON "TradeEvent"("entityType", "tradeDate");

-- CreateIndex
CREATE INDEX "TradeEvent_politicianId_tradeDate_idx" ON "TradeEvent"("politicianId", "tradeDate");

-- CreateIndex
CREATE INDEX "TradeEvent_insiderId_tradeDate_idx" ON "TradeEvent"("insiderId", "tradeDate");

-- CreateIndex
CREATE INDEX "TradeEvent_issuerId_tradeDate_idx" ON "TradeEvent"("issuerId", "tradeDate");

-- CreateIndex
CREATE INDEX "TradeEvent_assetId_tradeDate_idx" ON "TradeEvent"("assetId", "tradeDate");

-- CreateIndex
CREATE INDEX "TradeEvent_estimatedAmount_idx" ON "TradeEvent"("estimatedAmount");

-- CreateIndex
CREATE INDEX "TradeEvent_isImportant_tradeDate_idx" ON "TradeEvent"("isImportant", "tradeDate");

-- CreateIndex
CREATE INDEX "HoldingSnapshot_entityType_snapshotDate_idx" ON "HoldingSnapshot"("entityType", "snapshotDate");

-- CreateIndex
CREATE INDEX "HoldingSnapshot_politicianId_snapshotDate_idx" ON "HoldingSnapshot"("politicianId", "snapshotDate");

-- CreateIndex
CREATE INDEX "HoldingSnapshot_insiderId_snapshotDate_idx" ON "HoldingSnapshot"("insiderId", "snapshotDate");

-- CreateIndex
CREATE INDEX "HoldingSnapshot_assetId_snapshotDate_idx" ON "HoldingSnapshot"("assetId", "snapshotDate");

-- CreateIndex
CREATE INDEX "PerformanceSnapshot_snapshotDate_lookbackDays_idx" ON "PerformanceSnapshot"("snapshotDate", "lookbackDays");

-- CreateIndex
CREATE INDEX "PerformanceSnapshot_score_idx" ON "PerformanceSnapshot"("score");

-- CreateIndex
CREATE INDEX "PerformanceSnapshot_avgReturn30d_idx" ON "PerformanceSnapshot"("avgReturn30d");

-- CreateIndex
CREATE UNIQUE INDEX "PerformanceSnapshot_politicianId_snapshotDate_lookbackDays_key" ON "PerformanceSnapshot"("politicianId", "snapshotDate", "lookbackDays");

-- CreateIndex
CREATE INDEX "ActivitySnapshot_snapshotDate_windowDays_idx" ON "ActivitySnapshot"("snapshotDate", "windowDays");

-- CreateIndex
CREATE INDEX "ActivitySnapshot_activityScore_idx" ON "ActivitySnapshot"("activityScore");

-- CreateIndex
CREATE INDEX "ActivitySnapshot_tradeCount_idx" ON "ActivitySnapshot"("tradeCount");

-- CreateIndex
CREATE UNIQUE INDEX "ActivitySnapshot_politicianId_snapshotDate_windowDays_key" ON "ActivitySnapshot"("politicianId", "snapshotDate", "windowDays");

-- CreateIndex
CREATE INDEX "Testimonial_status_sortOrder_idx" ON "Testimonial"("status", "sortOrder");

-- CreateIndex
CREATE INDEX "Testimonial_locale_status_idx" ON "Testimonial"("locale", "status");

-- CreateIndex
CREATE INDEX "FeedbackSubmission_status_createdAt_idx" ON "FeedbackSubmission"("status", "createdAt");

-- CreateIndex
CREATE INDEX "FeedbackSubmission_email_idx" ON "FeedbackSubmission"("email");

-- AddForeignKey
ALTER TABLE "Insider" ADD CONSTRAINT "Insider_issuerId_fkey" FOREIGN KEY ("issuerId") REFERENCES "Issuer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_issuerId_fkey" FOREIGN KEY ("issuerId") REFERENCES "Issuer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TradeEvent" ADD CONSTRAINT "TradeEvent_politicianId_fkey" FOREIGN KEY ("politicianId") REFERENCES "Politician"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TradeEvent" ADD CONSTRAINT "TradeEvent_insiderId_fkey" FOREIGN KEY ("insiderId") REFERENCES "Insider"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TradeEvent" ADD CONSTRAINT "TradeEvent_issuerId_fkey" FOREIGN KEY ("issuerId") REFERENCES "Issuer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TradeEvent" ADD CONSTRAINT "TradeEvent_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TradeEvent" ADD CONSTRAINT "TradeEvent_rawFilingId_fkey" FOREIGN KEY ("rawFilingId") REFERENCES "RawFiling"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HoldingSnapshot" ADD CONSTRAINT "HoldingSnapshot_politicianId_fkey" FOREIGN KEY ("politicianId") REFERENCES "Politician"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HoldingSnapshot" ADD CONSTRAINT "HoldingSnapshot_insiderId_fkey" FOREIGN KEY ("insiderId") REFERENCES "Insider"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HoldingSnapshot" ADD CONSTRAINT "HoldingSnapshot_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerformanceSnapshot" ADD CONSTRAINT "PerformanceSnapshot_politicianId_fkey" FOREIGN KEY ("politicianId") REFERENCES "Politician"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivitySnapshot" ADD CONSTRAINT "ActivitySnapshot_politicianId_fkey" FOREIGN KEY ("politicianId") REFERENCES "Politician"("id") ON DELETE CASCADE ON UPDATE CASCADE;
