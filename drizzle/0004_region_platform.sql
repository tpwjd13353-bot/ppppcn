CREATE TABLE `platform_playbook` (
	`platformKey` text PRIMARY KEY NOT NULL,
	`nameKo` text NOT NULL,
	`nameCn` text,
	`roleTag` text,
	`icon` text,
	`descTemplate` text,
	`lockedTeaser` text,
	`sortOrder` integer DEFAULT 0,
	`enabled` integer DEFAULT true
);
--> statement-breakpoint
CREATE TABLE `region_insight` (
	`regionCode` text PRIMARY KEY NOT NULL,
	`regionName` text NOT NULL,
	`inboundTotal` integer,
	`inboundYoy` text,
	`residentForeigners` integer,
	`residentRank` integer,
	`regionAnnualVisitors` integer,
	`isEstimate` integer DEFAULT false,
	`sourceLabel` text,
	`commercialZones` text,
	`monthlyTrend` text,
	`peakNote` text,
	`updatedAt` integer NOT NULL
);
